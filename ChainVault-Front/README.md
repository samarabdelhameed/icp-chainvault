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

## Getting Started
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

