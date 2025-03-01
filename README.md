# icp-chainvault
# ChainVault: Unlocking Instant Bitcoin Liquidity

## Overview

ChainVault is a pioneering decentralized finance (DeFi) protocol developed on the Internet Computer Protocol (ICP) platform, designed to unlock instant liquidity for Bitcoin holders. By leveraging the seamless integration of ICP with the Bitcoin network, ChainVault enables users to use ckBTC as collateral to mint stablecoins, providing a secure and efficient solution for liquidity without compromising the inherent security of the Bitcoin network.


## Frontend intgration

## 🔗 Frontend Repository (In Progress)  

We are currently working on an improved version of the frontend. You can check out the latest repository here:  

🚀 [Frontend Last Repo (Work in Progress)](https://github.com/samarabdelhameed/icp-chainvault-frontend)


![Launch app](https://github.com/samarabdelhameed/pics/blob/main/50.png)
![Home page2](https://github.com/samarabdelhameed/pics/blob/main/51.png)
![Home page3](https://github.com/samarabdelhameed/pics/blob/main/52.png)
![Home page3](https://github.com/samarabdelhameed/pics/blob/main/53.png)
![Home page3](https://github.com/samarabdelhameed/pics/blob/main/54.png)

![Borrow Form](https://github.com/samarabdelhameed/pics/blob/main/borrow3.png)
![Withdraw Form](https://github.com/samarabdelhameed/pics/blob/main/withdraw.png)

# Project Title

## Presentation
project deployeed : https://chain-vault-front-lq0atklpo-samarabdelhameeds-projects.vercel.app/_app.html

Watch the presentation video on YouTube: [Presentation Video](https://www.youtube.com/watch?v=OX3CH_nsY88)
## Demo - Frontend

Watch the Frontend demo on YouTube: [frontend Demo Video](https://drive.google.com/file/d/1pmLpT4pEPvs-7oT_zXL5oVm_bUqSXKga/view?usp=sharing)



## Demo - Backend

Watch the backend demo on YouTube: [Backend Demo Video](https://www.youtube.com/watch?v=zH_UVhJcVKM)

## 📑 Security Audit Report  

We have conducted a **comprehensive security audit** to ensure the safety and reliability of the ICP-ChainVault platform.  
You can read the full report here:  

🔗 [View Security Audit Report](https://docs.google.com/document/d/1XANnNJpqm9B7iec7Ii1UF01mTcD2wGHI_6j3J7GhslM/edit?usp=sharing)



## Inspiration

The inception of ChainVault was motivated by the complexities and security concerns associated with converting Bitcoin into liquid assets. Traditional methods often compromise security or involve cumbersome bridging mechanisms. ChainVault addresses these challenges by offering a decentralized, secure, and user-friendly platform for Bitcoin liquidity.

## Key Features

- **Instant Liquidity Solutions:** Mint stablecoins against ckBTC collateral with ease.
- **BTC to ckBTC Conversion:** Direct BTC deposits are automatically converted to ckBTC, streamlining the process.
- **Compliance with ICRC-2 Standard:** Ensures compatibility and interoperability within the ICP ecosystem.
- **Vault Management System:** Users can effortlessly manage their vaults, loans, and collateral.
- **Robust Liquidation Mechanism:** Maintains the integrity of the system and the peg of the stablecoin.

## Architecture

ChainVault's architecture is built for robustness and scalability, utilizing the Azle framework (TypeScript) for the development of backend canisters. The system is composed of:

- **Oracle Canisters:** Provide up-to-date ckBTC price data.
- **Deposit Module:** Facilitates secure ckBTC or BTC deposits.
- **SynBase Canister:** Serves as the foundation for the ICRC-2 compatible stablecoins.
- **Minter Canister:** Manages the minting and burning processes of stablecoins.
- **Vault Manager Canister:** Central to managing user vaults, collateral, and loans.

The frontend is developed with NextJs, integrated with the Bitfinity wallet for a seamless user experience, emphasizing usability and design.

## flowchart 
![flow chart ChainVault project, which unlocks instant Bitcoin liquidity on the ICP platform. The chart outlines the process from a Bitcoin holder depositing BTC, through the conversion to ckBTC, minting stablecoins for liquidity, and managing vaults for security and efficiency.](https://github.com/samarabdelhameed/pics/blob/main/kKqQzm3q7m.png)


## Use Case icp-chainvault project 
![use case chart](https://github.com/samarabdelhameed/pics/blob/main/7xIwtfinro.png)

### Project Overview
- **Objective**: The ICP-ChainVault platform enables users to mint stablecoins, specifically cine USD (pegged to the US dollar), using CK BTC as collateral.
- **Target Audience**: Users holding CK BTC who wish to leverage their holdings to mint stablecoins without selling their cryptocurrency.

### How the Protocol Works
- **Collateral Token**: CK BTC.
- **Stablecoin**: cine USD, pegged 1:1 with the US dollar.
- **Interest Rate**: Annual Percentage Interest (API) of 1.5%.
- **Maximum Loan-to-Value Ratio**: 80%. Vaults exceeding this ratio are subject to liquidation.
- **Liquidation Charge**: 0.5%, processed centrally for security reasons, with plans to decentralize.

### Platform Features
- **Profile Section**: Users can deposit CK BTC directly or convert BTC to CK BTC through a provided deposit address, which then gets automatically deposited into the ICP-ChainVault protocol.
- **Vault Management**: Users can create vaults for borrowing, minting, or repaying debt, with options to manage collateral within these vaults. Vaults are user-specific and can be transferred with the creator's permission.

### Process Flow
1. **Vault Creation**: Users can create a vault, which is essentially a container for managing their transactions and collateral.
2. **Adding Collateral**: Users add CK BTC as collateral to their vault.
3. **Borrowing/Minting**: Users can borrow cine USD against their collateral, effectively minting new stablecoins. The process involves an interest rate, emphasizing the borrowing aspect.
4. **Repaying Debt**: Users can repay their borrowed amount plus interest to manage their vault's loan-to-value ratio and avoid liquidation.
5. **Interest and Staking**: The interest collected from borrowers will eventually be redirected to staking pools, allowing other users to stake their stablecoins and earn interest.

### Goals and Benefits
- **Liquidity Without Selling**: ICP-ChainVault aims to provide liquidity to CK BTC holders without the need to sell their holdings on exchanges.
- **Secure and Efficient**: By using CK BTC as collateral, users can efficiently mint stablecoins while maintaining security and control over their assets.


ICP-ChainVault presents a novel approach to leveraging cryptocurrency holdings for liquidity without direct selling. By focusing on CK BTC as collateral for minting stablecoins, it offers a secure and user-friendly platform for managing digital assets. The integration of features like vault management, collateral deposition, and interest-based borrowing outlines a comprehensive ecosystem for cryptocurrency liquidity and financial management.

## Development Challenges and Solutions

### Challenges

- **Implementing ICRC Standards:** Developing a TypeScript implementation from scratch due to the lack of existing implementations.
- **Oracle Compatibility:** Overcoming mainnet deployment issues related to IPV4 and IPV6 compatibility.
- **Complex System Design:** Ensuring a balance between complex backend logic and a seamless user interface.

### Accomplishments

- **Successful ICRC-2 Implementation:** Demonstrating technical expertise and adherence to best practices.
- **Simplified User Experience:** Streamlining the process of adding collateral and minting stablecoins.
- **Engaging UI Design:** Creating an intuitive and visually appealing user interface.

### Learnings

- **Leveraging ICP's Capabilities:** Utilizing ICP for direct blockchain interactions and ckBTC integration.
- **Secure Smart Contract Development:** Enhancing skills in developing secure and reliable DeFi protocols.
- **UI/UX Design:** Gaining insights into creating user-friendly and aesthetically pleasing interfaces.

## Future Roadmap

- **Security Enhancements:** Conducting thorough security reviews and external audits.
- **Frontend Improvements:** Further enhancing the user interface for an even smoother experience.
- **Decentralized Liquidation:** Moving towards a more decentralized liquidation process.
- **Staking Mechanisms:** Introducing staking protocols to add utility and promote stablecoin adoption.

## Canister IDs

- Oracle Canister: `nhkh6-wiaaa-aaaal-qcdpq-cai`
- Deposit Module Canister: `ivtqt-gqaaa-aaaal-qcdra-cai`
- SynBase Canister: `i3r53-5aaaa-aaaal-qcdqa-cai`
- Minter Canister: `i4q3p-qyaaa-aaaal-qcdqq-cai`
- Vault Manager Canister: `isswh-liaaa-aaaal-qcdrq-cai`


## Getting Started ChainVault-Front
## flowchart 
![flow chart ChainVault project frontend](https://github.com/samarabdelhameed/pics/blob/main/salE4qWvyE.png)

Clone the repository:

```bash
git clone https://github.com/samarabdelhameed/icp-chainvault.git
cd ChainVault-Front
```

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Getting Started ChainVault-Backend
# How to Deploy Locally
## flowchart 
![flow chart ChainVault project backend](https://github.com/samarabdelhameed/pics/blob/main/Cn9o7JujtF.png)
## Deploy the Canisters
1. **Start the Local Network:**
   ```sh
   cd ChainVault-Backend
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
dfx identity get-principal    

   ```sh
   dfx deploy synbase --argument='(record {
       name = "Synthetic USD";                         
       symbol = "SynUsd";                           
       decimal = 8;                                           
       fee = 10;
       permitted_drift_nanos = 86_400_000_000_000;
       transaction_window_nanos = 86_400_000_000_000;                                                                                   
       minting_account = (opt record {
           owner = principal "hkoto-7ykqd-y6gid-qvkx4-hxslt-lscav-zlc2f-nu7fx-movq2-v5ety-wqe";
           subaccount = null;
       });

       primary_account = (opt record {
           owner = principal "hkoto-7ykqd-y6gid-qvkx4-hxslt-lscav-zlc2f-nu7fx-movq2-v5ety-wqe";
           subaccount = null;
       });
   })'
   ```




## Conclusion

ChainVault represents a significant advancement in the DeFi space, offering a novel and secure solution for Bitcoin liquidity on the ICP platform. By bridging the gap between Bitcoin and decentralized finance, ChainVault paves the way for innovative financial solutions that prioritize security, efficiency, and user accessibility.

{
  "deposit": {
    "ic": "ivtqt-gqaaa-aaaal-qcdra-cai"
  },
  "oracle": {
    "ic": "nhkh6-wiaaa-aaaal-qcdpq-cai"
  },
  "synbase": {
    "ic": "i3r53-5aaaa-aaaal-qcdqa-cai"
  },
  "synthMinter": {
    "ic": "i4q3p-qyaaa-aaaal-qcdqq-cai"
  },
  "vaultmanager": {
    "ic": "isswh-liaaa-aaaal-qcdrq-cai"
  }
}


dfx canister status bd3sg-teaaa-aaaaa-qaaba-cai --network local

Canister status call result for bd3sg-teaaa-aaaaa-qaaba-cai.
Status: Running
Controllers: dhb5g-r3gjc-ywwb3-voxfo-dappg-bftgi-kvb25-x2y5w-ah62x-ldhvb-2ae
Memory allocation: 0
Compute allocation: 0
Freezing threshold: 2_592_000
Memory Size: Nat(3217295)
Balance: 99_999_520_780_023 Cycles
Reserved: 0 Cycles
Reserved cycles limit: 5_000_000_000_000 Cycles
Wasm memory limit: 0 Bytes
Module hash: 0x1208093dcc5b31286a073f00f748ac6612dbae17b66c22332762705960a8aaad
Number of queries: 17
Instructions spent in queries: 171_470_310
Total query request payload size (bytes): 29_525
Total query response payload size (bytes): 1_860_433
Log visibility: controllers
➜  ChainVault-Backend git:(main) ✗ dfx identity get-principal

dhb5g-r3gjc-ywwb3-voxfo-dappg-bftgi-kvb25-x2y5w-ah62x-ldhvb-2ae
➜  ChainVault-Backend git:(main) ✗ dfx deploy oracle --network local

Deploying: oracle
All canisters have already been created.
Building canisters...
Executing 'npx azle oracle'

Building canister oracle

[1/2] 🔨 Compiling TypeScript... 5.46s
[2/2] 🚧 Building Wasm binary... 10.90s

Done in 17.00s.

🎉 Built canister oracle at .azle/oracle/oracle.wasm.gz
Installing canisters...
Upgrading code for canister oracle, with canister ID bkyz2-fmaaa-aaaaa-qaaaq-cai
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    deposit: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=by6od-j4aaa-aaaaa-qaadq-cai
    oracle: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
    synbase: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=b77ix-eeaaa-aaaaa-qaada-cai
    synthMinter: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=br5f7-7uaaa-aaaaa-qaaca-cai
    vaultmanager: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai
➜  ChainVault-Backend git:(main) ✗ 

