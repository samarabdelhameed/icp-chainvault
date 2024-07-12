import { blob, nat, Principal, $query, $update, Record, Variant, Opt, Result } from 'azle';
import 'reflect-metadata';

type MetadataValue = Variant<{
    int: int;
    nat: nat;
    blob: blob;
    text: string;
}>;

type TokenMetadata = Record<{
    fee: nat;
    decimals: nat8;
    owner: Principal;
    logo: Opt<string>;
    name: string;
    symbol: string;
    meta: Vec<Record<{
        key: string;
        value: MetadataValue;
    }>>;
}>;

type InitArgs = Record<{
    name: string;
    symbol: string;
    decimals: nat8;
    initial_supply: nat;
}>;

type TransferArgs = Record<{
    from: Principal;
    to: Principal;
    amount: nat;
}>;

type BalanceArgs = Record<{
    of: Principal;
}>;

export class ICRC1Token {
    private balances: StableBTreeMap<Principal, nat> = new StableBTreeMap<Principal, nat>(0, 100, 0);
    private metadata: TokenMetadata;

    constructor(args: InitArgs) {
        this.metadata = {
            fee: 0n,
            decimals: args.decimals,
            owner: ic.caller(),
            logo: Opt.None,
            name: args.name,
            symbol: args.symbol,
            meta: []
        };
        this.balances.insert(ic.caller(), args.initial_supply);
    }

    $query;
    getMetadata(): TokenMetadata {
        return this.metadata;
    }

    $query;
    balanceOf(args: BalanceArgs): nat {
        return this.balances.get(args.of).unwrapOr(0n);
    }

    $update;
    transfer(args: TransferArgs): Result<nat, string> {
        const from_balance = this.balances.get(args.from).unwrapOr(0n);
        if (from_balance < args.amount) {
            return Result.Err("Insufficient balance");
        }
        const to_balance = this.balances.get(args.to).unwrapOr(0n);
        this.balances.insert(args.from, from_balance - args.amount);
        this.balances.insert(args.to, to_balance + args.amount);
        return Result.Ok(args.amount);
    }
}
