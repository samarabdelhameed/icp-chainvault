# How to Deploy Locally
## flowchart 
![flow chart ChainVault project backend](https://github.com/samarabdelhameed/pics/blob/main/Cn9o7JujtF.png)


## Deploy the Canisters

### 1. Start the Local Network:
```sh
cd ChainVault-Backend
dfx start
```
- Running `dfx start` for version 0.16.1
- Using the default definition for the 'local' shared network because `/Users/s/.config/dfx/networks.json` does not exist.
- Initialized replica.
- Dashboard: [http://localhost:55431/_/dashboard](http://localhost:55431/_/dashboard)

### 2. Deploy the Oracle Canister:
```sh
dfx deploy oracle
```
- Deploying: oracle
- Creating canisters...
- Creating canister oracle...
- oracle canister created with canister id: bd3sg-teaaa-aaaaa-qaaba-cai
- Building canisters...
- Executing 'npx azle oracle'
- Building canister oracle
- [1/2] 🔨 Compiling TypeScript... 17.95s
- [2/2] 🚧 Building Wasm binary... 101.99s
- Done in 121.18s.
- 🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
- Installing canisters...
- Creating UI canister on the local network.
- The UI canister on the "local" network is "be2us-64aaa-aaaaa-qaabq-cai"
- Installing code for canister oracle, with canister ID bd3sg-teaaa-aaaaa-qaaba-cai
- Deployed canisters.
- URLs:
  - Backend canister via Candid interface:
    - deposit: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai)
    - oracle: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai)

### 3. Deploy the Deposit Canister:
```sh
dfx deploy deposit
```
- Deploying: deposit
- Creating a wallet canister on the local network.
- The wallet canister on the "local" network for user "default" is "bnz7o-iuaaa-aaaaa-qaaaa-cai"
- Creating canisters...
- Creating canister deposit...
- deposit canister created with canister id: bkyz2-fmaaa-aaaaa-qaaaq-cai
- Building canisters...
- Executing 'npx azle deposit'
- Building canister deposit
- Initial build takes a few minutes. Don't panic. Subsequent builds will be faster.
- [0/2] 🏗️  Preparing prerequisites... 68.63s
- [1/2] 🔨 Compiling TypeScript... 449.52s
- [2/2] 🚧 Building Wasm binary... 128.23s
- Done in 647.01s.
- 🎉 Built canister deposit at .azle/deposit/deposit.wasm.gz
- Installing canisters...
- Creating UI canister on the local network.
- The UI canister on the "local" network is "br5f7-7uaaa-aaaaa-qaaca-cai"
- Installing code for canister deposit, with canister ID bkyz2-fmaaa-aaaaa-qaaaq-cai
- Deployed canisters.
- URLs:
  - Backend canister via Candid interface:
    - deposit: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai)
    - oracle: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai)

### 4. Deploy the VaultManager Canister:
```sh
dfx deploy vaultmanager
```
- Deploying: vaultmanager
- Creating canisters...
- Creating canister vaultmanager...
- vaultmanager canister created with canister id: bw4dl-smaaa-aaaaa-qaacq-cai
- Building canisters...
- Executing 'npx azle vaultmanager'
- Building canister vaultmanager
- [1/2] 🔨 Compiling TypeScript... 7.95s
- [2/2] 🚧 Building Wasm binary... 16.39s
- Done in 25.08s.
- 🎉 Built canister vaultmanager at .azle/vaultmanager/vaultmanager.wasm.gz
- Installing canisters...
- Installing code for canister vaultmanager, with canister ID bw4dl-smaaa-aaaaa-qaacq-cai
- Deployed canisters.
- URLs:
  - Backend canister via Candid interface:
    - deposit: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai)
    - oracle: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai)
    - vaultmanager: [http://127.0.

0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai)

### 5. Deploy the SynthMinter Canister:
```sh
dfx deploy synthMinter
```
- Deploying: synthMinter
- Creating canisters...
- Creating canister synthMinter...
- synthMinter canister created with canister id: b77ix-eeaaa-aaaaa-qaada-cai
- Building canisters...
- Executing 'npx azle synthMinter'
- Building canister synthMinter
- [1/2] 🔨 Compiling TypeScript... 6.33s
- [2/2] 🚧 Building Wasm binary... 14.40s
- Done in 21.52s.
- 🎉 Built canister synthMinter at .azle/synthMinter/synthMinter.wasm.gz
- Installing canisters...
- Installing code for canister synthMinter, with canister ID b77ix-eeaaa
-aaaaa-qaada-cai
- Deployed canisters.
- URLs:
  - Backend canister via Candid interface:
    - deposit: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai)
    - oracle: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai)
    - synthMinter: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=b77ix-eeaaa-aaaaa-qaada-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=b77ix-eeaaa-aaaaa-qaada-cai)
    - vaultmanager: [http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai](http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai)

### 6. Deploy the SynBase Canister with Argument:
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

## Further Configuration

1. **Deploy an icrc-1 Compatible Token** to mimic the behaviour of ckbtc.

2. **Update the Canister Addresses in the Codes:**
   - Mainly in `vaultmanager` code and `oracle`.

3. **Update the Canister Address of SynthMinter in VaultManager.**

4. **Update the Canister Address of Oracle in VaultManager.**

5. **Update the Canister Address of SynBase in SynthMinter.**
```