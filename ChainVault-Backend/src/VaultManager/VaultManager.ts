import {
    Record, Principal, $update, Result, CallResult, ic, Service, serviceUpdate, $query, nat, float64, nat32, float32, match, Vec, blob, nat64,
    serviceQuery, Opt
} from "azle";
import { initDate, VaultStorageData, IndividualVaultData, VaultStateData, VaultMetadata, AdministrativeData } from "./types";
import { VaultStorage, IndividualVaultStorage, UserVaultIdMapping } from "./storage";
import { TransferError, AllowanceArgs, Allowance, Account, TransferFromArgs } from "../synthsBase/types"
import { calculateNewAccumulator } from './helpers'

import { ICRC, ICRCTransferError, ICRCTransferArgs } from 'azle/canisters/icrc'
import { padPrincipalWithZeros, padSubAccount } from "../synthsBase/helper";

import { TransferFromError } from "../synthsBase/types";
import { IcrcTransferError } from "@dfinity/ledger";

// This means that 1 token = 1*10^8
const decimalplaces: nat = 8n

class Oracle extends Service {
    @serviceUpdate
    getBTCUSDT: () => CallResult<string>
}

class DepositModule extends Service {
    @serviceUpdate
    getBalance: (of: Principal) => CallResult<nat>

    @serviceUpdate
    transferToVault: (from: Principal, vaultId: nat, _VaultManagerAddress: Principal, amount: nat) => CallResult<Result<nat, ICRCTransferError>>
}

class SynthMinter extends Service {
    @serviceUpdate
    mintToken: (amount: nat, account: Account, memo: Opt<blob>) => CallResult<Result<nat, TransferError>>
}

class SynthToken extends Service {
    @serviceQuery
    icrc2_allowance: (allowance_args: AllowanceArgs) => CallResult<Allowance>
    @serviceQuery
    icrc1_balance_of: (Account: Account) => CallResult<nat>
    @serviceUpdate
    icrc2_transfer_from: (args: TransferFromArgs) => CallResult<Result<nat, TransferFromError>>
}

const ckBTC = new ICRC(
    Principal.fromText("mxzaz-hqaaa-aaaar-qaada-cai")
);

const SynthMinterCanister = new SynthMinter(
    Principal.fromText("i4q3p-qyaaa-aaaal-qcdqq-cai")
)

const SynthTokenCanister = new SynthToken(
    Principal.fromText("i3r53-5aaaa-aaaal-qcdqa-cai")
)

const oracleCanister = new Oracle(
    Principal.fromText("nhkh6-wiaaa-aaaal-qcdpq-cai"))

const DepositModuleCanister = new DepositModule(
    Principal.fromText("ivtqt-gqaaa-aaaal-qcdra-cai"))

let ckBTCPrincipal: Principal;
let SynthMinterPrincipal: Principal;
let SynthTokenPrincipal: Principal;
let OraclePrincipal: Principal;
let DepositModulePrincipal: Principal;

$update;
export function setCanisterIDs(ckBTC: Principal, synthMinter: Principal, synthToken: Principal, oracle: Principal, depositModule: Principal): Result<string, string> {
    ckBTCPrincipal = ckBTC;
    SynthMinterPrincipal = synthMinter;
    SynthTokenPrincipal = synthToken;
    OraclePrincipal = oracle;
    DepositModulePrincipal = depositModule;
    return Result.Ok<string, string>("Canister IDs set successfully");
}

$update;
export function init(InitData: VaultStorageData): Result<string, string> {
    VaultStorage.insert(1n, InitData)
    return Result.Ok<string, string>("Done")
}

$update;
export function testInit(): Result<string, string> {
    const vaultMetadata: VaultMetadata = {
        CollateralName: "CKBTC",
        DebtTokeName: "SYNTUSD"
    }

    const vaultStateData: VaultStateData = {
        interestFeePercentage: 0.05,
        CollateralPrincipal: ckBTC.canisterId,

        DebtTokenPrincipal: SynthTokenCanister.canisterId,

        priimary_owner: Principal.fromText("2vxsx-fae"),

        oracle: oracleCanister.canisterId,
        currentAccumulatorValue: 1,
        lastAccumulatorUpdateTime_seconds: convertNanoToSec(ic.time()),
        interestPerSecond: 1.0000000015471259578632124490458629971738336463351819964451
    }

    const administrativeData: AdministrativeData = {
        priimary_owner: Principal.fromText("2vxsx-fae"),
        guardians: []
    }

    const tranasactions: Vec<IndividualVaultData> = []

    const finalData: VaultStorageData = {
        VaultMedata: vaultMetadata,
        VaultStateData: vaultStateData,
        AdministrativeData: administrativeData,
        vaultCounter: 0n,
        Transactions: tranasactions
    }

    VaultStorage.insert(1n, finalData)
    return Result.Ok<string, string>("Done")
}

$update;
export function resetVault(): string {
    const currentState: VaultStorageData = match(VaultStorage.get(1n), {
        Some: (args) => {
            return (args)
        },
        None: () => ic.trap("Some error occured1")
    })

    const updateVaultData: VaultStorageData = {
        ...currentState,
        vaultCounter: 0n
    }

    VaultStorage.insert(1n, updateVaultData)

    const keys: Vec<Principal> = UserVaultIdMapping.keys()
    for (const k of keys) {
        UserVaultIdMapping.remove(k)
    }
    return ("done")
}

// this is used to create empty Vault 
// @param: For this user to enter any blob if necessary
$update;
export function createVault(memo: Opt<blob>): nat {

    const currentState: VaultStorageData = match(VaultStorage.get(1n), {
        Some: (args) => {
            return (args)
        },
        None: () => ic.trap("Some error occured1")
    })

    const currentVaultIds: Vec<nat> = match(UserVaultIdMapping.get(ic.caller()), {
        Some: (args) => {
            return (args)
        },
        None: () => []
    })

    const nextVaultId = currentState.vaultCounter + 1n

    const IndiVidiualVaultData: IndividualVaultData = {
        normalisedDebt: 0,
        VaultCreationTime: ic.time(),
        primaryOwner: ic.caller(),
        vaultCollaterisationRatio: 0,
        vaultCurrentCollateral: 0,
        vaultId: nextVaultId,
        isActive: false,
        memo: memo,
        vaultLtvRatio: Infinity
    }

    IndividualVaultStorage.insert(nextVaultId, IndiVidiualVaultData)

    const updatedVaultIds: Vec<nat> = [...currentVaultIds, nextVaultId]
    UserVaultIdMapping.insert(ic.caller(), updatedVaultIds)

    const UpdateTransaction: Vec<IndividualVaultData> = [...currentState.Transactions, IndiVidiualVaultData]
    const updateVaultData: VaultStorageData = {
        ...currentState,
        Transactions: UpdateTransaction,
        vaultCounter: nextVaultId
    }

    VaultStorage.insert(1n, updateVaultData)
    return (nextVaultId)
}

$query;
export function getVaultDetails(vaultId: nat): IndividualVaultData {
    return (match(IndividualVaultStorage.get(vaultId), {
        Some(arg) {
            return arg
        },
        None(arg) {
            ic.trap("issue with")
        },
    }))
}

// @note: Anyone can 
// @note: check for vaultId has to exist 
// @todo: Don't forget to add new accumulator to the storage 

// @note: Vault collaterisation rate is not update only the vault ltv ratio is update 
// @todo: Add the transaction to transactionld 
// Todo; Vault collateral should be in how much in $value not in ckbtc amount

// Promise<Result<nat, string>>
$update;
export async function addCollateral(_vaultId: nat, collateralAmount: nat): Promise<Result<nat, ICRCTransferError>> {
    const Caller: Principal = ic.caller()

    const decimalAdjustCollateral: float64 = adjustDecimals(collateralAmount)

    const currentLedgerTime = ic.time()

    const currentVaultData = match(IndividualVaultStorage.get(_vaultId), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Please create a vault  before you add collateral")
    })

    const currentStateData = match(VaultStorage.get(1n), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Error occured while query state data ")
    })

    const Balance = match(await DepositModuleCanister.getBalance(Caller).call(), {
        Ok(arg) {
            return arg
        },
        Err(arg) {
            ic.trap(arg)
        },
    })

    // @todo: Test this not sure if this comparison is correct
    // 1) Should compare it without decimal adjusting it 
    // 2) Should I compare the dollar value 
    // 3) Should I compare with decimal adjust it 
    if (Balance < collateralAmount) {
        ic.trap(`You do not have sufficient balance please deposit using Deposit Page ${Balance}`)
    }

    const result = match(await DepositModuleCanister.transferToVault(Caller, _vaultId, ic.id(), collateralAmount).call(), {
        Ok(arg) {
            return arg
        },
        Err(arg) {
            ic.trap(`Error in transfer to vault ${arg}`)
        },
    })

    const finalCallResult = (match(result, {
        Ok(arg) {
            return (Result.Ok<nat, ICRCTransferError>(arg))
        },
        Err(arg) {
            return Result.Err<nat, ICRCTransferError>(arg)
        },
    }))

    if ('Err' in finalCallResult) {
        if (finalCallResult.Err !== undefined) {
            return (Result.Err<nat, ICRCTransferError>(finalCallResult.Err))
        }
        ic.trap(`Error occured in call token transfer ${finalCallResult.Err}  `)
    }

    const currentAccumulator: float64 = currentStateData.VaultStateData.currentAccumulatorValue

    const interestPerSecond: float64 = currentStateData.VaultStateData.interestPerSecond
    const timeinSeconds: nat32 = convertNanoToSec(currentLedgerTime) - currentStateData.VaultStateData.lastAccumulatorUpdateTime_seconds
    const newAccumulatorValue: float64 = calculatenewAccumulator(currentAccumulator, interestPerSecond, timeinSeconds)

    const currentNormalisedDebt: float64 = currentVaultData.normalisedDebt

    const currentVaultActualDebt: float64 = currentNormalisedDebt * newAccumulatorValue

    const vaultUpdatedCollateral: float64 = currentVaultData.vaultCurrentCollateral + decimalAdjustCollateral

    const collateralAmountInDollars = await collateralAmountInDolalr(vaultUpdatedCollateral)
    const updatedLtv: float64 = currentVaultActualDebt / collateralAmountInDollars

    // Sanity check to make sure ltv was update // 0.8 = 80%
    if (updatedLtv > 0.8) {
        ic.trap("Error in account LTV . LTV value greater than 80%")
    }

    // Update Overall Vault State 
    const newVaultStateData: VaultStateData = {
        ...currentStateData.VaultStateData,
        currentAccumulatorValue: newAccumulatorValue,
        lastAccumulatorUpdateTime_seconds: convertNanoToSec(currentLedgerTime)
    }

    const newVaultStorageData: VaultStorageData = {
        ...currentStateData,
        VaultStateData: newVaultStateData
    }

    VaultStorage.insert(1n, newVaultStorageData)

    // Individual vault data 
    const newIndividualData: IndividualVaultData = {
        ...currentVaultData,
        isActive: true,
        vaultLtvRatio: updatedLtv,
        vaultCurrentCollateral: vaultUpdatedCollateral
    }

    IndividualVaultStorage.insert(_vaultId, newIndividualData)

    return (Result.Ok<nat, ICRCTransferError>(collateralAmount))
}

// @todo: Add this transaction to the overall state transaction list 
// @todo: Update the accumulator value in state 
// @todo: Update the 

// Promise<nat>
// Promise<Result<nat, TransferError>>
$update;
export async function borrow(_vaultId: nat, __debt: nat): Promise<Result<nat, TransferError>> {

    const Caller: Principal = ic.caller()
    const debt = adjustDecimals(__debt)
    const currentLedgerTime = ic.time()
    // Checking whether the vaultId exist 
    const currentVaultData = match(IndividualVaultStorage.get(_vaultId), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Please create a vault  before you borrow")
    })

    if (currentVaultData.primaryOwner.toString() !== Caller.toString()) {
        ic.trap("You are not the vault owner ")
    }

    const currentStateData = match(VaultStorage.get(1n), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Error occured while query state data ")
    })
    const currentAccumulator: float64 = currentStateData.VaultStateData.currentAccumulatorValue

    const interestPerSecond: float64 = currentStateData.VaultStateData.interestPerSecond

    const timeinSeconds: nat32 = convertNanoToSec(currentLedgerTime) - currentStateData.VaultStateData.lastAccumulatorUpdateTime_seconds

    const newAccumulatorValue: float64 = calculatenewAccumulator(currentAccumulator, interestPerSecond, timeinSeconds)

    const normalisedDebt: float64 = normalizeDebt(debt, newAccumulatorValue)

    const updatedNormalisedDebt: float64 = currentVaultData.normalisedDebt + normalisedDebt

    const currentVaultActualDebt: float64 = updatedNormalisedDebt * newAccumulatorValue

    const currentVaultCollateral: float64 = currentVaultData.vaultCurrentCollateral

    const currentCollateralInDollars: float64 = await collateralAmountInDolalr(currentVaultCollateral)

    const LTV: float64 = currentVaultActualDebt / currentCollateralInDollars

    if (LTV > 0.8) {
        ic.trap(`You do not enough collateral for this transaction AND LTV VALUE IS ${LTV} and current amount in dollars ${currentCollateralInDollars} and current vault actual debt ${currentVaultActualDebt} `)
    }

    const account: Account = {
        owner: Caller,
        subaccount: Opt.None
    }
    const result = match(await SynthMinterCanister.mintToken(__debt, account, Opt.None).call(), {
        Ok(arg) {
            return arg
        },
        Err(arg) {
            ic.trap("issue with mint token")
            ic.trap(arg)
        },
    })

    if (result.Err !== undefined) {
        return (Result.Err<nat, TransferError>(result.Err))
        ic.trap("issue ")
    }

    const updateIndividualData: IndividualVaultData = {
        ...currentVaultData,
        normalisedDebt: updatedNormalisedDebt,
        vaultLtvRatio: LTV
    }
    IndividualVaultStorage.insert(_vaultId, updateIndividualData)

    const updatedVaultSateData: VaultStateData = {
        ...currentStateData.VaultStateData,
        currentAccumulatorValue: newAccumulatorValue,
        lastAccumulatorUpdateTime_seconds: convertNanoToSec(currentLedgerTime)
    }

    const updateVaultStorageData: VaultStorageData = {
        ...currentStateData,
        VaultStateData: updatedVaultSateData
    }

    VaultStorage.insert(1n, updateVaultStorageData)

    return (Result.Ok<nat, TransferError>(__debt))
}

// @todo: Add this transaction to transaction list 
// @todo: Assumption the _debtToRepay will be entered in 8 decimals format 
// @todo: Add the burning mechanism for 
// Result<nat, TransferFromError>
$update;
export async function repayDebt(_vaultId: nat, _debtToRepay: nat, __subAccount: Opt<blob>): Promise<Result<nat, TransferFromError>> {
    const Caller: Account = padSubAccount({ owner: ic.caller(), subaccount: __subAccount })
    const debt = adjustDecimals(_debtToRepay)

    const currentLedgerTime = ic.time()
    // Checking whether the vaultId exist 
    const currentVaultData = match(IndividualVaultStorage.get(_vaultId), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap(`Please create a vault  before you borrow ${_vaultId}`)
    })

    if (currentVaultData.primaryOwner.toString() !== ic.caller().toString()) {
        ic.trap(`You are not the vault owner ${currentVaultData.primaryOwner.toString()}`)
    }

    const currentStateData = match(VaultStorage.get(1n), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Error occured while query state data ")
    })

    const balance: nat = match(await SynthTokenCanister.icrc1_balance_of(Caller).call(), {
        Ok(arg) {
            return arg
        },
        Err(arg) {
            ic.trap(arg)
        },
    })

    if (balance < _debtToRepay) {
        ic.trap("You do not have sufficient balance to repay the debt")
    }

    const AlllowanceArgs: AllowanceArgs = {
        account: Caller,
        spender: {
            owner: ic.id(),
            subaccount: Opt.None
        }
    }
    const allowanceCallResult = match(await SynthTokenCanister.icrc2_allowance(AlllowanceArgs).call(), {
        Ok(arg) {
            return (arg)
        },
        Err(arg) {
            ic.trap(arg)
        },
    })

    if (allowanceCallResult.allowance < _debtToRepay) {
        ic.trap(`No sufficient allowance for account ${AlllowanceArgs}`)
    }

    if (allowanceCallResult.expires_at.Some !== undefined) {
        if (allowanceCallResult.expires_at.Some < ic.time()) {
            ic.trap(`Allowance time has passed ${ic.time()} `)
        }
    }

    const transferFrom: TransferFromArgs = {
        spender_subaccount: Opt.None,
        from: Caller,
        to: {
            owner: SynthMinterCanister.canisterId,
            subaccount: Opt.None
        },
        amount: _debtToRepay,
        fee: Opt.None,
        memo: Opt.None,
        created_at_time: Opt.None
    }
    const transferFromResult = match(await SynthTokenCanister.icrc2_transfer_from(transferFrom).call(), {
        Ok(arg) {
            return arg
        },
        Err(arg) {
            ic.trap(arg)
        },
    })

    if (transferFromResult.Err !== undefined) {

        return Result.Err<nat, TransferFromError>(transferFromResult.Err)

    }

    const currentAccumulator: float64 = currentStateData.VaultStateData.currentAccumulatorValue

    const interestPerSecond: float64 = currentStateData.VaultStateData.interestPerSecond

    const timeinSeconds: nat32 = convertNanoToSec(currentLedgerTime) - currentStateData.VaultStateData.lastAccumulatorUpdateTime_seconds

    const newAccumulatorValue: float64 = calculatenewAccumulator(currentAccumulator, interestPerSecond, timeinSeconds)

    const normalisedDebt: float64 = normalizeDebt(debt, newAccumulatorValue)

    const updatedNormalisedDebt: float64 = currentVaultData.normalisedDebt - normalisedDebt

    const currentVaultActualDebt: float64 = updatedNormalisedDebt * newAccumulatorValue

    const currentVaultCollateral: float64 = currentVaultData.vaultCurrentCollateral

    const currentCollateralInDollars: float64 = await collateralAmountInDolalr(currentVaultCollateral)

    const LTV: float64 = currentVaultActualDebt / currentCollateralInDollars

    if (LTV > 0.8) {
        ic.trap("You do not enough collateral for this transaction ")
    }

    const individualVaultData: IndividualVaultData = {
        ...currentVaultData,
        normalisedDebt: updatedNormalisedDebt,
        vaultLtvRatio: LTV
    }
    IndividualVaultStorage.insert(_vaultId, individualVaultData)

    const VaultStateData: VaultStateData = {
        ...currentStateData.VaultStateData,
        currentAccumulatorValue: newAccumulatorValue,
        lastAccumulatorUpdateTime_seconds: convertNanoToSec(currentLedgerTime)
    }

    const VaultStorageData: VaultStorageData = {
        ...currentStateData,
        VaultStateData: VaultStateData
    }

    VaultStorage.insert(1n, VaultStorageData)
    return (Result.Ok<nat, TransferFromError>(_debtToRepay))
}

$update;
// @note: the amount has to be entered in decimal adjusted form 8 decimals 
export async function withdrawCollateral(_vaultId: nat, _amountToWithdraw: nat, _toAccount: Account): Promise<Result<float64, ICRCTransferError>> {
    const Caller: Principal = ic.caller()

    const toAccount: Account = padSubAccount(_toAccount)
    const amountToWithdraw: float64 = adjustDecimals(_amountToWithdraw)
    const vaultId: nat = _vaultId

    const currentLedgerTime = ic.time()
    // Checking whether the vaultId exist 
    const currentVaultData = match(IndividualVaultStorage.get(vaultId), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Please create a vault  before you borrow")
    })

    if (currentVaultData.primaryOwner.toString() !== Caller.toString()) {
        ic.trap(`You are not the vault owner ${currentVaultData.primaryOwner.toString()}`)
    }

    const currentStateData = match(VaultStorage.get(1n), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Error occured while query state data ")
    })

    const currentAccumulator: float64 = currentStateData.VaultStateData.currentAccumulatorValue

    const interestPerSecond: float64 = currentStateData.VaultStateData.interestPerSecond

    const timeinSeconds: nat32 = convertNanoToSec(currentLedgerTime) - currentStateData.VaultStateData.lastAccumulatorUpdateTime_seconds

    const newAccumulatorValue: float64 = calculatenewAccumulator(currentAccumulator, interestPerSecond, timeinSeconds)

    const updatedNormalisedDebt: float64 = currentVaultData.normalisedDebt

    const currentVaultActualDebt: float64 = updatedNormalisedDebt * newAccumulatorValue

    const currentVaultCollateral: float64 = currentVaultData.vaultCurrentCollateral

    const updatedVaultCollateral: float64 = currentVaultCollateral - amountToWithdraw

    const currentCollateralInDollars: float64 = await collateralAmountInDolalr(updatedVaultCollateral)

    const LTV: float64 = currentVaultActualDebt / currentCollateralInDollars

    if (LTV > 0.8) {
        ic.trap("You do not enough collateral for this transaction ")
    }

    const subaccount: blob = bigNumberToUint8Array(vaultId)
    const result = match(await ckBTC
        .icrc1_transfer({
            from_subaccount: Opt.Some(
                padPrincipalWithZeros(subaccount)
            ),
            to: toAccount,
            amount: _amountToWithdraw,
            fee: Opt.Some(10n),
            memo: Opt.None,
            created_at_time: Opt.None
        })
        .call(), {
        Ok(arg) {
            return arg
        },
        Err(arg) {
            ic.trap(arg)
        },
    });

    if (result.Err !== undefined) {
        return Result.Err<float64, ICRCTransferError>(result.Err)
    }

    const individualVaultData: IndividualVaultData = {
        ...currentVaultData,
        vaultLtvRatio: LTV,
        vaultCurrentCollateral: updatedVaultCollateral,
    }
    IndividualVaultStorage.insert(_vaultId, individualVaultData)

    const VaultStateData: VaultStateData = {
        ...currentStateData.VaultStateData,
        currentAccumulatorValue: newAccumulatorValue,
        lastAccumulatorUpdateTime_seconds: convertNanoToSec(currentLedgerTime)
    }

    const VaultStorageData: VaultStorageData = {
        ...currentStateData,
        VaultStateData: VaultStateData
    }

    VaultStorage.insert(1n, VaultStorageData)

    return (Result.Ok<float64, ICRCTransferError>(amountToWithdraw))
}

$update;
// Function to get the price from the oracle 
export async function getBtcPrice(): Promise<string> {
    const currentBtcPrice = await oracleCanister.getBTCUSDT().call()

    if (currentBtcPrice.Ok != undefined) {
        return currentBtcPrice.Ok
    }

    return "Some Error Occured"
}

$update;
export async function collateralAmountInDolalr(amount: float64): Promise<float64> {
    const currentBtcPrice: float64 = parseFloat(await getBtcPrice())

    return (amount * currentBtcPrice)
}

$query;
export async function getVaultActualDebt(vaultId: nat): Promise<float64> {
    const currentLedgerTime = ic.time()
    // Checking whether the vaultId exist 
    const currentVaultData = match(IndividualVaultStorage.get(vaultId), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Please create a vault  before you query")
    })

    const currentStateData = match(VaultStorage.get(1n), {
        Some(arg) {
            return arg
        },
        None: () => ic.trap("Error occured while query state data ")
    })

    const currentAccumulator: float64 = currentStateData.VaultStateData.currentAccumulatorValue

    const interestPerSecond: float64 = currentStateData.VaultStateData.interestPerSecond

    const timeinSeconds: nat32 = convertNanoToSec(currentLedgerTime) - currentStateData.VaultStateData.lastAccumulatorUpdateTime_seconds

    const newAccumulatorValue: float64 = calculatenewAccumulator(currentAccumulator, interestPerSecond, timeinSeconds)

    const updatedNormalisedDebt: float64 = currentVaultData.normalisedDebt

    const currentVaultActualDebt: float64 = updatedNormalisedDebt * newAccumulatorValue

    return (currentVaultActualDebt)
}

// Should be entered to 15 decimal precision 
// will retu
$query;
export function calculatenewAccumulator(currentAcumulator: float64, interestPerSecond: float64, timeInSeconds: nat32): float64 {
    const newAccumulatorValue = calculateNewAccumulator(currentAcumulator, interestPerSecond, timeInSeconds)
    return (newAccumulatorValue)
}

$query;
export function normalizeDebt(debt: float64, newAccumulatorValue: float64): float64 {

    // @TODO: CHANGE THESE DEFAULT VALUES
    // const newAccumulatorValue:float64 = calculateNewAccumulator(1,1.0000000007829976090829093519527471510922262217819607847470,31536000)

    // const roundedAccumulatorValue :nat  = BigInt(Math.round(newAccumulatorValue * Math.pow(10,8)))

    const normalizedDebt: float64 = Number(debt) / Number(newAccumulatorValue)
    // return(debt/finalValue)
    return (normalizedDebt)
    // // const divideValue:nat = BigInt((debt/newAccumulatorValue) * BigInt(10**8))
    // return(debt/newAccumulatorValue)
}

$query;
export function getUserVaultIds(account: Principal): Vec<nat> {
    return (match(UserVaultIdMapping.get(account), {
        Some(arg) {
            return (arg)
        },
        None: () => ic.trap("Not user found")
    }))
}

function convertNanoToSec(nanoseconds: nat): nat32 {
    return Number(nanoseconds / 1_000_000_000n);
}

function adjustDecimals(amount: nat): float64 {
    const decimals: nat = BigInt(Math.pow(10, 8))

    return (Number(amount * decimals / decimals) / 100000000)
}

function bigNumberToUint8Array(bigNumber: nat): blob {
    const str = bigNumber.toString();
    const array = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i);
    }
    return array;
}
