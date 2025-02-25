# ICP-ChainVault

ICP-ChainVault is a robust synthetic asset management system built on the Internet Computer Protocol (ICP). It leverages smart contracts to handle synthetic asset minting, collateral management, and oracle integration for asset pricing. The system ensures secure and efficient management of synthetic assets, enabling users to deposit assets, create vaults, and manage synthetic tokens seamlessly.

## Features

- **Synthetic Asset Minting**: Mint synthetic tokens backed by collateral.
- **Collateral Management**: Manage and add collateral to vaults, ensuring adequate backing for synthetic assets.
- **Oracle Integration**: Fetch real-time price data from oracles for accurate asset valuation.
- **Secure Transfers**: Handle secure token transfers, approvals, and allowances.
- **Comprehensive Storage**: Utilize stable storage for tracking balances, vault states, and allowances.

## Project Structure

```
ICP-ChainVault/
├── src/
│   ├── DepositModule/
│   │   ├── ckBTCDeposit.ts
│   │   └── minter.ts
│   ├── OracleModule/
│   │   ├── oracle.ts
│   │   └── types.ts
│   ├── VaultManager/
│   │   ├── VaultManager.ts
│   │   ├── helpers.ts
│   │   ├── storage.ts
│   │   └── types.ts
│   ├── synthsBase/
│   │   ├── TokenMinter/
│   │   │   └── SynthTokenMinter.ts
│   │   ├── Update/
│   │   │   ├── approveMain.ts
│   │   │   └── transferMain.ts
│   │   ├── query/
│   │   │   └── queryFunctions.ts
│   │   ├── storage/
│   │   │   └── storage.ts
│   │   ├── transfers/
│   │   │   ├── burn.ts
│   │   │   ├── mint.ts
│   │   │   ├── transfer.ts
│   │   │   ├── transferFrom.ts
│   │   │   └── transferFromBurn.ts
│   │   ├── index.ts
│   │   └── init.ts
│   └── candidFiles/
│       ├── deposit.did
│       ├── oracle.did
│       ├── synbase.did
│       ├── synthMinter.did
│       └── vaultmanager.did
├── README.md
└── package.json
```
## Detailed Explanation of Key Modules

### DepositModule
Handles Bitcoin deposits and interactions with the ckBTC token.

- **ckBTCDeposit.ts**: 
  - Manages Bitcoin deposit operations.
  - Functions: `getBalance()`, `updateBalance()`, `getBtcDepositAddress()`, `transferToVault()`.

- **minter.ts**:
  - Defines the `Minter` service.
  - Functions: `get_btc_address()`, `update_balance()`.

### OracleModule
Integrates with an exchange rate oracle to fetch real-time price data.

- **oracle.ts**:
  - Interacts with the exchange rate oracle.
  - Functions: `getBTCUSDT()`, `btcPriceTranForm()`.

- **types.ts**:
  - Defines types for asset classes, exchange rate requests, and results.

### VaultManager
Manages the creation and operation of vaults, including collateral management and debt operations.

- **VaultManager.ts**:
  - Core logic for vault management.
  - Functions: `init()`, `createVault()`, `addCollateral()`, `borrow()`, `repayDebt()`, `withdrawCollateral()`, `getBtcPrice()`, `collateralAmountInDollar()`, `getVaultActualDebt()`, `normalizeDebt()`, `getUserVaultIds()`.

- **helpers.ts**:
  - Helper functions for calculations.
  - Functions: `calculateNewAccumulator()`.

- **storage.ts**:
  - Storage definitions for vault data.
  - Structures: `VaultStorage`, `UserVaultIdMapping`, `IndividualVaultStorage`.

- **types.ts**:
  - Defines types for vault metadata, state data, individual vault data.

### synthsBase
Base module for managing synthetic tokens, including minting, transfers, and approvals.

- **TokenMinter/SynthTokenMinter.ts**:
  - Minting operations for synthetic tokens.
  - Functions: `mintToken()`, `updateVaultManager()`.

- **Update/approveMain.ts**:
  - Approval logic for token transfers.
  - Functions: `icrc2_approve()`, `testingFee()`.

- **Update/transferMain.ts**:
  - Handles token transfers and allowances.
  - Functions: `icrc1_transfer()`, `icrc2_transfer_from()`.

- **query/queryFunctions.ts**:
  - Query functions for retrieving token metadata and balances.
  - Functions: `icrc1_name()`, `icrc1_symbol()`, `icrc1_decimals()`, `icrc1_fee()`, `icrc1_metadata()`, `icrc1_total_supply()`, `icrc1_minting_account()`, `icrc1_supported_standards()`, `icrc1_balance_of()`, `icrc2_allowance()`.

- **storage/storage.ts**:
  - Storage management for token states, balances, and allowances.
  - Structures: `TokenState`, `AccountBalance`, `AllowanceStorage`.

- **transfers/burn.ts**:
  - Logic for burning tokens.
  - Function: `handle_burn()`.

- **transfers/mint.ts**:
  - Logic for minting tokens.
  - Function: `handle_mint()`.

- **transfers/transfer.ts**:
  - Handles token transfer operations.
  - Function: `handle_transfer()`.

- **transfers/transferFrom.ts**:
  - Implements logic for transferring tokens using allowances.
  - Function: `handle_transfer_from()`.

- **transfers/transferFromBurn.ts**:
  - Manages transfers that result in token burns.
  - Function: `handle_transfer_from_burn()`.

- **index.ts**:
  - Exports various functions and modules.
  - Functions: `icrc1_symbol()`, `icrc1_name()`, `icrc1_decimals()`, `icrc1_total_supply()`, `icrc1_minting_account()`, `icrc1_supported_standards()`, `icrc1_metadata()`, `icrc2_allowance()`, `icrc1_fee()`, `icrc1_balance_of()`, `testPadAccount()`.

- **init.ts**:
  - Initialization logic for the token state.
  - Functions: `constructor()`, `testingTokenState()`, `updateMinterAccount()`, `updatePrimaryAccount()`.



### Steps and Commands

1. **Stop DFX:**
   Ensure that DFX is stopped:

   ```sh
   dfx stop
   ```

2. **Delete the Local State:**
   Delete the entire DFX state directory to ensure a fresh start:

   ```sh
   rm -rf "/Users/s/Library/Application Support/org.dfinity.dfx/network/local/state"
   ```

3. **Clean the NPM Modules and Cache:**
   Clean the NPM modules and cache to ensure no issues with dependencies:

   ```sh
   rm -rf node_modules
   npm cache clean --force
   ```

4. **Reinstall Dependencies:**
   Reinstall the NPM dependencies:

   ```sh
   npm install --legacy-peer-deps
   ```

5. **Start DFX:**
   Start DFX again:

   ```sh
   dfx start
   ```

6. **Create the `synbase` Canister:**
   Create the `synbase` canister:

   ```sh
   dfx canister create synbase
   ```

7. **Rebuild All Canisters:**
   Rebuild all canisters:

   ```sh
   dfx build
   ```

### Example README Section

## Setup and Build Instructions

1. **Stop DFX:**
   Ensure that DFX is stopped:

   ```sh
   dfx stop
   ```

2. **Delete the Local State:**
   Delete the entire DFX state directory to ensure a fresh start:

   ```sh
   rm -rf "/Users/s/Library/Application Support/org.dfinity.dfx/network/local/state"
   ```

3. **Clean the NPM Modules and Cache:**
   Clean the NPM modules and cache to ensure no issues with dependencies:

   ```sh
   rm -rf node_modules
   npm cache clean --force
   ```

4. **Reinstall Dependencies:**
   Reinstall the NPM dependencies:

   ```sh
   npm install --legacy-peer-deps
   ```

5. **Start DFX:**
   Start DFX again:

   ```sh
   dfx start
   ```

6. **Create the `synbase` Canister:**
   Create the `synbase` canister:

   ```sh``
   dfx canister create synbase
   ```

7. **Rebuild All Canisters:**
   Rebuild all canisters:

   ```sh
   dfx build
   ```
```

   ```
# How to Deploy Locally
## Demo - Backend

Watch the backend demo on YouTube: [Backend Demo Video](https://www.youtube.com/watch?v=zH_UVhJcVKM)

## Deploy the Canisters
1. **Start the Local Network:**
   ```sh
   cd ChainVault-Backend
    npm install reflect-metadata --save --legacy-peer-deps
   dfx start
   ```
Running dfx start for version 0.16.1
Using the default definition for the 'local' shared network because /Users/s/.config/dfx/networks.json does not exist.
Initialized replica.
Dashboard: http://localhost:55431/_/dashboard

2. **Deploy the Oracle Canister:**
   ```sh
   dfx deploy oracle
   ```
dfx deploy oracle                                             
Deploying: oracle
Creating canisters...
Creating canister oracle...
oracle canister created with canister id: bd3sg-teaaa-aaaaa-qaaba-cai
Building canisters...
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 5.32s
[2/2] 🚧 Building Wasm binary... 21.80s

Done in 27.79s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Installing canisters...
Creating UI canister on the local network.
The UI canister on the "local" network is "be2us-64aaa-aaaaa-qaabq-cai"
Installing code for canister oracle, with canister ID bd3sg-teaaa-aaaaa-qaaba-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    oracle: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai

3. **Deploy the Deposit Canister:**
   ```sh
   dfx deploy deposit
   ```
   dfx deploy deposit
Deploying: deposit
Creating canisters...
Creating canister deposit...
deposit canister created with canister id: br5f7-7uaaa-aaaaa-qaaca-cai
Building canisters...
Executing 'npx azle deposit'

Building canister deposit

[1/2] 🔨 Compiling TypeScript... 6.76s
[2/2] 🚧 Building Wasm binary... 9.25s

Done in 16.69s.

🎉 Built canister deposit at .azle/deposit/deposit.wasm.gz
Installing canisters...
Installing code for canister deposit, with canister ID br5f7-7uaaa-aaaaa-qaaca-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai
    oracle: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai

4. **Deploy the VaultManager Canister:**
   ```sh
   dfx deploy vaultmanager
   ```
   dfx deploy vaultmanager
Deploying: vaultmanager
Creating canisters...
Creating canister vaultmanager...
vaultmanager canister created with canister id: bw4dl-smaaa-aaaaa-qaacq-cai
Building canisters...
Executing 'npx azle vaultmanager'

Building canister vaultmanager

[1/2] 🔨 Compiling TypeScript... 7.05s
[2/2] 🚧 Building Wasm binary... 11.08s

Done in 18.83s.

🎉 Built canister vaultmanager at .azle/vaultmanager/vaultmanager.wasm.gz
Installing canisters...
Installing code for canister vaultmanager, with canister ID bw4dl-smaaa-aaaaa-qaacq-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai
    oracle: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai

5. **Deploy the SynthMinter Canister:**
   ```sh
   dfx deploy synthMinter
   ```
   dfx deploy synthMinter
Deploying: synthMinter
Creating canisters...
Creating canister synthMinter...
synthMinter canister created with canister id: b77ix-eeaaa-aaaaa-qaada-cai
Building canisters...
Executing 'npx azle synthMinter'

Building canister synthMinter

[1/2] 🔨 Compiling TypeScript... 6.33s
[2/2] 🚧 Building Wasm binary... 21.46s

Done in 28.47s.

🎉 Built canister synthMinter at .azle/synthMinter/synthMinter.wasm.gz
Installing canisters...
Installing code for canister synthMinter, with canister ID b77ix-eeaaa-aaaaa-qaada-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai
    oracle: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    synthMinter: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=b77ix-eeaaa-aaaaa-qaada-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai
    
6. **Deploy the SynBase Canister with Argument:**
 ```sh
dfx identity get-principal                                   


hkoto-7ykqd-y6gid-qvkx4-hxslt-lscav-zlc2f-nu7fx-movq2-v5ety-wqe
➜   dfx canister id synthMinter
b77ix-eeaaa-aaaaa-qaada-cai
 ```

   ```sh
dfx deploy synbase --argument='(record {
    name = "Synthetic USD";
    symbol = "SynUsd";
    decimal = 8;
    fee = 10;
    permitted_drift_nanos = 86400000000000;
    transaction_window_nanos = 86400000000000;
    minting_account = (opt record {
        owner = principal "br5f7-7uaaa-aaaaa-qaaca-cai";
        subaccount = null;
    });
    primary_account = (opt record {
      hfao-epw3w-htxiz-lg52d-kawgm-zw4x3-tv3xm-jeeru-yqx6a-tmw5u-3ae
        owner = principal "dhb5g-r3gjc-ywwb3-voxfo-dappg-bftgi-kvb25-x2y5w-ah62x-ldhvb-2ae";
        subaccount = null;
    });
})'

   ```
   **All the canisters have been successfully deployed. Here are the URLs for the backend canisters via the Candid interface:**
    ```sh
Deposit: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai
Oracle: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai
Synbase: http://127.0.0.1:4943/?canisterId=bkyz2-fmaaa-aaaaa-qaaaq-cai
SynthMinter: http://127.0.0.1:4943/?canisterId=bw4dl-smaaa-aaaaa-qaacq-cai
VaultManager: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai


dfx canister status synbase

Canister status call result for synbase.
Status: Running
Controllers: bnz7o-iuaaa-aaaaa-qaaaa-cai hkoto-7ykqd-y6gid-qvkx4-hxslt-lscav-zlc2f-nu7fx-movq2-v5ety-wqe
Memory allocation: 0
Compute allocation: 0
Freezing threshold: 2_592_000
Memory Size: Nat(63950141)
Balance: 3_091_561_157_027 Cycles
Reserved: 0 Cycles
Reserved Cycles Limit: 5_000_000_000_000 Cycles
WASM Memory Limit: 0 Bytes
Module hash: 0xb6e5f8ddd56be2d8bce8e75b4b956b6c4e7b8a9e4c45a1f3597469118ad73d90
Number of queries: 0
Instructions spent in queries: 0
Total query request payload size (bytes): 0
Total query response payload size (bytes): 0


**Verify and Test the Canisters:**
1. **Get the Balance from the Deposit Canister:**
Call the getBalance function of the deposit canister
-   dfx canister call deposit updateVaultManagerAddress '(principal "br5f7-7uaaa-aaaaa-qaaca-cai")'

("ok")

- 



## Further Configuration
1. **Deploy an icrc-1 Compatible Token** to mimic the behaviour of ckbtc.
dfx build icrc1_token
dfx deploy icrc1_token

Building canisters...
Executing 'npx azle icrc1_token'

Building canister icrc1_token

[1/2] 🔨 Compiling TypeScript... 1.71s
[2/2] 🚧 Building Wasm binary... 9.16s

Done in 11.51s.

🎉 Built canister icrc1_token at .azle/icrc1_token/icrc1_token.wasm.gz
Deploying: icrc1_token
All canisters have already been created.
Building canisters...
Executing 'npx azle icrc1_token'

Building canister icrc1_token

[1/2] 🔨 Compiling TypeScript... 1.80s
[2/2] 🚧 Building Wasm binary... 4.36s

Done in 6.74s.

🎉 Built canister icrc1_token at .azle/icrc1_token/icrc1_token.wasm.gz
Installing canisters...
Installing code for canister icrc1_token, with canister ID avqkn-guaaa-aaaaa-qaaea-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=be2us-64aaa-aaaaa-qaabq-cai
    icrc1_token: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=avqkn-guaaa-aaaaa-qaaea-cai
    oracle: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    synbase: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    synthMinter: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai
➜  


2. **Update the Canister Addresses in the Codes:**
   - Mainly in `vaultmanager` code and `oracle`.

3. **Update the Canister Address of SynthMinter in VaultManager.**
dfx build

Building canisters...
Executing 'npx azle synthMinter'

Building canister synthMinter

[1/2] 🔨 Compiling TypeScript... 5.81s
[2/2] 🚧 Building Wasm binary... 8.35s

Done in 14.77s.

🎉 Built canister synthMinter at .azle/synthMinter/synthMinter.wasm.gz
Executing 'npx azle vaultmanager'

Building canister vaultmanager

[1/2] 🔨 Compiling TypeScript... 6.96s
[2/2] 🚧 Building Wasm binary... 9.74s

Done in 17.35s.

🎉 Built canister vaultmanager at .azle/vaultmanager/vaultmanager.wasm.gz
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 5.13s
[2/2] 🚧 Building Wasm binary... 7.57s

Done in 13.32s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Executing 'npx azle icrc1_token'

Building canister icrc1_token

[1/2] 🔨 Compiling TypeScript... 1.64s
[2/2] 🚧 Building Wasm binary... 4.28s

Done in 6.50s.

🎉 Built canister icrc1_token at .azle/icrc1_token/icrc1_token.wasm.gz
Executing 'npx azle deposit'

Building canister deposit

[1/2] 🔨 Compiling TypeScript... 6.59s
[2/2] 🚧 Building Wasm binary... 8.26s

Done in 15.47s.

🎉 Built canister deposit at .azle/deposit/deposit.wasm.gz
Executing 'npx azle synbase'

Building canister synbase

[1/2] 🔨 Compiling TypeScript... 4.87s
[2/2] 🚧 Building Wasm binary... 7.08s

Done in 12.58s.

🎉 Built canister synbase at .azle/synbase/synbase.wasm.gz

dfx deploy vaultmanager

Deploying: vaultmanager
All canisters have already been created.
Building canisters...
Executing 'npx azle vaultmanager'

Building canister vaultmanager

[1/2] 🔨 Compiling TypeScript... 7.25s
[2/2] 🚧 Building Wasm binary... 10.71s

Done in 18.63s.

🎉 Built canister vaultmanager at .azle/vaultmanager/vaultmanager.wasm.gz
Installing canisters...
Upgrading code for canister vaultmanager, with canister ID br5f7-7uaaa-aaaaa-qaaca-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=be2us-64aaa-aaaaa-qaabq-cai
    icrc1_token: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=avqkn-guaaa-aaaaa-qaaea-cai
    oracle: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    synbase: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    synthMinter: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai

dfx canister call vaultmanager testInit

(variant { Ok = "Done" })



4. **Update the Canister Address of Oracle in VaultManager.**
dfx build

Building canisters...
Executing 'npx azle icrc1_token'

Building canister icrc1_token

[1/2] 🔨 Compiling TypeScript... 1.89s
[2/2] 🚧 Building Wasm binary... 5.81s

Done in 8.29s.

🎉 Built canister icrc1_token at .azle/icrc1_token/icrc1_token.wasm.gz
Executing 'npx azle deposit'

Building canister deposit

[1/2] 🔨 Compiling TypeScript... 6.58s
[2/2] 🚧 Building Wasm binary... 8.71s

Done in 15.90s.

🎉 Built canister deposit at .azle/deposit/deposit.wasm.gz
Executing 'npx azle vaultmanager'

Building canister vaultmanager

[1/2] 🔨 Compiling TypeScript... 6.93s
[2/2] 🚧 Building Wasm binary... 11.16s

Done in 18.78s.

🎉 Built canister vaultmanager at .azle/vaultmanager/vaultmanager.wasm.gz
Executing 'npx azle synbase'

Building canister synbase

[1/2] 🔨 Compiling TypeScript... 4.82s
[2/2] 🚧 Building Wasm binary... 7.00s

Done in 12.45s.

🎉 Built canister synbase at .azle/synbase/synbase.wasm.gz
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 2.16s
[2/2] 🚧 Building Wasm binary... 4.62s

Done in 7.36s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Executing 'npx azle synthMinter'

Building canister synthMinter

[1/2] 🔨 Compiling TypeScript... 5.76s
[2/2] 🚧 Building Wasm binary... 7.52s

Done in 13.89s.

🎉 Built canister synthMinter at .azle/synthMinter/synthMinter.wasm.gz

dfx deploy oracle

Deploying: oracle
All canisters have already been created.
Building canisters...
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 2.22s
[2/2] 🚧 Building Wasm binary... 5.63s

Done in 8.44s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Installing canisters...
Upgrading code for canister oracle, with canister ID bd3sg-teaaa-aaaaa-qaaba-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=be2us-64aaa-aaaaa-qaabq-cai
    icrc1_token: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=avqkn-guaaa-aaaaa-qaaea-cai
    oracle: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    synbase: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    synthMinter: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai

dfx canister status oracle

Canister status call result for oracle.
Status: Running
Controllers: 7dmok-m2ubv-u2fct-jbdrq-5ibns-mfiso-z7r7a-2rhsv-q6xsl-tqpmm-fae bnz7o-iuaaa-aaaaa-qaaaa-cai
Memory allocation: 0
Compute allocation: 0
Freezing threshold: 2_592_000
Memory Size: Nat(4667776)
Balance: 3_088_611_594_822 Cycles
Reserved: 0 Cycles
Reserved Cycles Limit: 5_000_000_000_000 Cycles
WASM Memory Limit: 0 Bytes
Module hash: 0xac6c976698a86531dbab1c1127b9df164b2a091339134ba05dd6d9f0189a6ed9
Number of queries: 0
Instructions spent in queries: 0
Total query request payload size (bytes): 0
Total query response payload size (bytes): 0

dfx deploy oracle

Deploying: oracle
All canisters have already been created.
Building canisters...
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 5.10s
[2/2] 🚧 Building Wasm binary... 19.36s

Done in 25.09s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Installing canisters...
Upgrading code for canister oracle, with canister ID bd3sg-teaaa-aaaaa-qaaba-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=be2us-64aaa-aaaaa-qaabq-cai
    icrc1_token: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=avqkn-guaaa-aaaaa-qaaea-cai
    oracle: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    synbase: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    synthMinter: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai
➜  ChainVault-Backend git:(main) ✗ 

dfx build oracle
dfx deploy oracle

Building canisters...
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 5.40s
[2/2] 🚧 Building Wasm binary... 23.31s

Done in 29.36s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Deploying: oracle
All canisters have already been created.
Building canisters...
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 5.21s
[2/2] 🚧 Building Wasm binary... 7.64s

Done in 13.46s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Installing canisters...
Upgrading code for canister oracle, with canister ID bd3sg-teaaa-aaaaa-qaaba-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=be2us-64aaa-aaaaa-qaabq-cai
    icrc1_token: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=avqkn-guaaa-aaaaa-qaaea-cai
    oracle: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    synbase: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    synthMinter: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=by6od-j4aaa-aaaaa-qaadq-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai
    

5. **Update the Canister Address of SynBase in SynthMinter.**



6. **Deploy the SynBase Canister with Argument:**
   ```sh
   dfx deploy synbase --argument='(record {
       name = "Synthetic USD";                         
       symbol = "SynUsd";                           
       decimal = 8;                                           
       fee = 10;
       permitted_drift_nanos = 86_400_000_000_000;
       transaction_window_nanos = 86_400_000_000_000;                                                                                   
       minting_account = (opt record {
           owner = principal "<canister id of synthminter deployed above>";
           subaccount = null;
       });

       primary_account = (opt record {
           owner = principal "<enter your principal>";
           subaccount = null;
       });
   })'
   ```