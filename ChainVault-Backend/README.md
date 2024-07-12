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

   ```sh
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
   Deploying: oracle
Creating canisters...
Creating canister oracle...
oracle canister created with canister id: bd3sg-teaaa-aaaaa-qaaba-cai
Building canisters...
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 17.95s
[2/2] 🚧 Building Wasm binary... 101.99s

Done in 121.18s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Installing canisters...
Creating UI canister on the local network.
The UI canister on the "local" network is "be2us-64aaa-aaaaa-qaabq-cai"
Installing code for canister oracle, with canister ID bd3sg-teaaa-aaaaa-qaaba-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    oracle: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai

3. **Deploy the Deposit Canister:**
   ```sh
   dfx deploy deposit
   ```
   Deploying: deposit
Creating a wallet canister on the local network.
The wallet canister on the "local" network for user "default" is "bnz7o-iuaaa-aaaaa-qaaaa-cai"
Creating canisters...
Creating canister deposit...
deposit canister created with canister id: bkyz2-fmaaa-aaaaa-qaaaq-cai
Building canisters...
Executing 'npx azle deposit'

Building canister deposit

Initial build takes a few minutes. Don't panic. Subsequent builds will be faster.

[0/2] 🏗️  Preparing prerequisites... 68.63s
[1/2] 🔨 Compiling TypeScript... 449.52s
[2/2] 🚧 Building Wasm binary... 128.23s

Done in 647.01s.

🎉 Built canister deposit at .azle/deposit/deposit.wasm.gz
Installing canisters...
Creating UI canister on the local network.
The UI canister on the "local" network is "br5f7-7uaaa-aaaaa-qaaca-cai"
Installing code for canister deposit, with canister ID bkyz2-fmaaa-aaaaa-qaaaq-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    oracle: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
➜  ChainVault-Backend git:(main) ✗ 

4. **Deploy the VaultManager Canister:**
   ```sh
   dfx deploy vaultmanager
   ```
   Deploying: vaultmanager
Creating canisters...
Creating canister vaultmanager...
vaultmanager canister created with canister id: bw4dl-smaaa-aaaaa-qaacq-cai
Building canisters...
Executing 'npx azle vaultmanager'

Building canister vaultmanager

[1/2] 🔨 Compiling TypeScript... 7.95s
[2/2] 🚧 Building Wasm binary... 16.39s

Done in 25.08s.

🎉 Built canister vaultmanager at .azle/vaultmanager/vaultmanager.wasm.gz
Installing canisters...
Installing code for canister vaultmanager, with canister ID bw4dl-smaaa-aaaaa-qaacq-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    oracle: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai

5. **Deploy the SynthMinter Canister:**
   ```sh
   dfx deploy synthMinter
   ```
   Deploying: synthMinter
Creating canisters...
Creating canister synthMinter...
synthMinter canister created with canister id: b77ix-eeaaa-aaaaa-qaada-cai
Building canisters...
Executing 'npx azle synthMinter'

Building canister synthMinter

[1/2] 🔨 Compiling TypeScript... 6.33s
[2/2] 🚧 Building Wasm binary... 14.40s

Done in 21.52s.

🎉 Built canister synthMinter at .azle/synthMinter/synthMinter.wasm.gz
Installing canisters...
Installing code for canister synthMinter, with canister ID b77ix-eeaaa-aaaaa-qaada-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    oracle: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai
    synthMinter: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=b77ix-eeaaa-aaaaa-qaada-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai
    
6. **Deploy the SynBase Canister with Argument:**
 ```sh
 dfx identity get-principal

elgv4-xvf4l-qtu3a-7cbf5-cmnjq-taxy7-jlgj4-bbi2b-25fga-s5rva-wae
➜   dfx canister id synthMinter

a3shf-5eaaa-aaaaa-qaafa-cai
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
        owner = principal "a3shf-5eaaa-aaaaa-qaafa-cai";
        subaccount = null;
    });
    primary_account = (opt record {
        owner = principal "elgv4-xvf4l-qtu3a-7cbf5-cmnjq-taxy7-jlgj4-bbi2b-25fga-s5rva-wae";
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

**Verify and Test the Canisters:**
1. **Get the Balance from the Deposit Canister:**
Call the getBalance function of the deposit canister
-   dfx canister call deposit updateVaultManagerAddress '(principal "br5f7-7uaaa-aaaaa-qaaca-cai")'

("ok")

- 



## Further Configuration
1. **Deploy an icrc-1 Compatible Token** to mimic the behaviour of ckbtc.

2. **Update the Canister Addresses in the Codes:**
   - Mainly in `vaultmanager` code and `oracle`.

3. **Update the Canister Address of SynthMinter in VaultManager.**

4. **Update the Canister Address of Oracle in VaultManager.**

5. **Update the Canister Address of SynBase in SynthMinter.**
