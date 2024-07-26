import {
    Alias,
    ic,
    $init,
    match,
    nat32,
    $query,
    StableBTreeMap,
    $update,
    Opt,
    Record,
    nat8,
    nat,
    Principal,
    blob,
    Variant,
    int,
    nat64,
    Vec,
    Tuple
} from 'azle';

import { InitArgs, State, AllowanceKey, Account, AllowanceStorageData, Allowance } from './types';
import { AllowanceStorage, TokenState, AccountBalance } from './storage/storage';
import { padSubAccount } from './helper';

$init;
export function constructor(Init: InitArgs): void {
    const state: State = {
        decimals: Init.decimal,
        fee: Init.fee,
        metadata: [
            ['icrc1:decimals', { Nat: BigInt(Init.decimal) }],
            ['icrc1:fee', { Nat: Init.fee }],
            ['icrc1:name', { Text: Init.name }],
            ['icrc1:symbol', { Text: Init.symbol }],
        ],
        minting_account: Init.minting_account,
        primary_account: Init.primary_account,
        name: Init.name,
        permitted_drift_nanos: Init.permitted_drift_nanos,
        supported_standards: [
            {
                name: 'ICRC-1',
                url: 'https://github.com/dfinity/ICRC-1'
            },
            {
                name: 'ICRC-2',
                url: 'https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-2'
            },
        ],
        symbol: Init.symbol,
        transaction_window_nanos: Init.transaction_window_nanos,
        total_supply: 0n,
        transactions: [],
    };
    TokenState.insert(1n, state);
}

$update;
export async function mint(to: Account, amount: nat): Promise<string> {
    const state = match(TokenState.get(1n), {
        Some: (s) => s,
        None: () => ic.trap("State not initialized")
    });

    if (state.minting_account === null) {
        return "Minting account not set";
    }

    const recipient = { owner: to.owner, subaccount: to.subaccount };

    if (!AccountBalance.containsKey(recipient)) {
        AccountBalance.insert(recipient, amount);
    } else {
        const current_balance = AccountBalance.get(recipient)!;
        AccountBalance.insert(recipient, current_balance + amount);
    }

    state.total_supply += amount;
    TokenState.insert(1n, state);

    return `Minted ${amount.toString()} tokens to ${to.owner.toText()}`;
}

$update;
export function updateMinterAccount(account: Principal): string {
    const currentTokenState = match(TokenState.get(1n), {
        Some: (s) => s,
        None: () => ic.trap("State not initialized")
    });

    const newState: State = {
        ...currentTokenState,
        minting_account: Opt.Some({
            owner: account,
            subaccount: Opt.None
        })
    };

    TokenState.insert(1n, newState);
    return "done";
}

$update;
export function updatePrimaryAccount(account: Principal): string {
    const currentTokenState = match(TokenState.get(1n), {
        Some: (s) => s,
        None: () => ic.trap("State not initialized")
    });

    const newState: State = {
        ...currentTokenState,
        primary_account: Opt.Some({
            owner: account,
            subaccount: Opt.None
        })
    };

    TokenState.insert(1n, newState);
    return "done";
}

$query;
export function getCurrentState(): State {
    return match(TokenState.get(1n), {
        Some: (s) => s,
        None: () => ic.trap("State not initialized")
    });
}
