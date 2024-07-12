import {
    blob,
    ic,
    match,
    nat,
    nat64,
    Opt,
    Principal,
    $update,
    Variant,
    $query,
    Result
} from 'azle';
import { ICRC, ICRCTransferError } from 'azle/canisters/icrc';

import { UpdateBalanceResult, Minter } from './minter';
import { Account } from '../synthsBase/types';
import { padSubAccount } from '../synthsBase/helper';

// Update the canister IDs to the correct ones
const ckBTC = new ICRC(
    Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai") // Update to the correct ID
);

const minter = new Minter(
    Principal.fromText("bd3sg-teaaa-aaaaa-qaaba-cai") // Update to the correct ID
);

let VaultManagerAddress: Principal;

$update;
export async function getBalance(of: Principal): Promise<nat> {
    const result = await ckBTC
        .icrc1_balance_of({
            owner: ic.id(),
            subaccount: Opt.Some(
                padPrincipalWithZeros(of.toUint8Array())
            )
        })
        .call();

    return match(result, {
        Ok: (ok) => ok,
        Err: (err) => ic.trap(err)
    });
}

$update;
export async function updateBalance(of: Principal): Promise<UpdateBalanceResult> {
    const result = await minter
        .update_balance({
            owner: Opt.Some(ic.id()),
            subaccount: Opt.Some(
                padPrincipalWithZeros(of.toUint8Array())
            )
        })
        .call();

    return match(result, {
        Ok: (ok) => ok,
        Err: (err) => ic.trap(err)
    });
}

$update;
export async function getBtcDepositAddress(of: Principal): Promise<string> {
    const result = await minter
        .get_btc_address({
            owner: Opt.Some(ic.id()),
            subaccount: Opt.Some(
                padPrincipalWithZeros(of.toUint8Array())
            )
        })
        .call();

    return match(result, {
        Ok: (ok) => ok,
        Err: (err) => ic.trap(err)
    });
}

$update;
export async function transferToVault(from: Principal, vaultId: nat, _VaultManagerAddress: Principal, _amount: nat): Promise<Result<nat, ICRCTransferError>> {
    if (ic.caller().toString() != VaultManagerAddress.toString()) {
        ic.trap("Only Vault can call this function");
    }

    const subaccount: blob = bigNumberToUint8Array(vaultId);
    const toAccount: Account = {
        owner: _VaultManagerAddress,
        subaccount: Opt.Some(subaccount)
    };

    const result = await ckBTC
        .icrc1_transfer({
            from_subaccount: Opt.Some(
                padPrincipalWithZeros(from.toUint8Array())
            ),
            to: padSubAccount(toAccount),
            amount: _amount,
            fee: Opt.Some(10n),
            memo: Opt.None,
            created_at_time: Opt.None
        })
        .call();

    const calResult = match(result, {
        Ok: (ok) => (ok),
        Err: (err) => ic.trap(`Call Result Error ${err}`)
    });

    return match(calResult, {
        Ok(arg) {
            return Result.Ok<nat, ICRCTransferError>(arg);
        },
        Err(arg) {
            return Result.Err<nat, ICRCTransferError>(arg);
        },
    });
}

function padPrincipalWithZeros(blob: blob): blob {
    let newUin8Array = new Uint8Array(32);
    newUin8Array.set(blob);
    return newUin8Array;
}

function bigNumberToUint8Array(bigNumber: nat): blob {
    const str = bigNumber.toString();
    const array = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        array[i] = str.charCodeAt(i);
    }
    return array;
}

$update;
export function getTime(): nat {
    return (ic.time());
}

$query;
export function getCaller(): Principal {
    return (ic.caller());
}

$query;
export function getUint8array(account: Principal): blob {
    return (padPrincipalWithZeros(account.toUint8Array()));
}

$update;
export function updateVaultManagerAddress(address: Principal): string {
    VaultManagerAddress = address;
    return ("ok");
}
