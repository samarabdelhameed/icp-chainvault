import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../assets/styles/Borrow.module.css";
import Link from "next/link";
import Head from "next/head";
import { Principal } from "@dfinity/principal";

import { idlFactory as vaultManagerIdlFactory } from "../vaultmanager.did.js";
import { synBaseIdlFactory } from "../synBase.did";
import {
  _SERVICE as VaultManagerService,
  IndividualVaultData,
  AllowanceArgs,
} from "@/vaultmanager(ts).did";
import { _SERVICE as SynBaseService } from "@/synbase(t).did";

const VAULT_MANAGER_ADDRESS = "isswh-liaaa-aaaal-qcdrq-cai";
const SYNTH_TOKEN_ADDRESS = "i3r53-5aaaa-aaaal-qcdqa-cai";
const SYNTH_MINTER_ADDRESS = "i4q3p-qyaaa-aaaal-qcdqq-cai";

const WHITELIST = [
  VAULT_MANAGER_ADDRESS,
  SYNTH_TOKEN_ADDRESS,
  SYNTH_MINTER_ADDRESS,
];

const Borrow = () => {
  // State Variables
  const [vaultID, setVaultID] = useState("");
  const [synthUsdAmount, setSynthUsdAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [debtToRepay, setDebtToRepay] = useState("");
  const [selectedOption, setSelectedOption] = useState("Borrow");
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vaultManager, setVaultManager] = useState<VaultManagerService | null>(
    null
  );
  const [currentVaultDetails, setCurrentVaultDetails] =
    useState<IndividualVaultData | null>(null);
  const [connectedPrincipal, setConnectedPrincipal] = useState<Principal | null>(
    null
  );
  const [currentVaultIds, setCurrentVaultIds] = useState<Array<bigint>>([]);
  const [allowance, setAllowance] = useState<any>(null); // Update type based on your Allowance interface
  const [synBaseService, setSynBaseService] = useState<SynBaseService | null>(
    null
  );
  const [actualUserDebt, setActualUserDebt] = useState<number | null>(null);

  const router = useRouter();

  // Effect Hooks
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const isConnected = await window.ic.infinityWallet.isConnected();
        setIsConnected(isConnected);

        if (isConnected) {
          const principal = await window.ic.infinityWallet.getPrincipal();
          setConnectedPrincipal(principal);
          const address = principal.toText();
          setConnectedAddress(address);
          await createVaultManagerActor();
          await createSynthTokenActor();
          console.log(`Connected user's public key:`, principal);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (selectedOption === "Create Vault" && vaultManager !== null) {
      fetchUserVaultIds();
    }
  }, [selectedOption, vaultManager]);

  useEffect(() => {
    const main = async () => {
      await checkAllowance();
    };

    main();
  }, []);

  // Utility Functions
  const validateBorrowFields = () => {
    const synthUsdAmountNum = parseFloat(synthUsdAmount);

    if (vaultID === "" || isNaN(synthUsdAmountNum) || synthUsdAmountNum < 0) {
      alert("Please fill in all required fields correctly");
      return false;
    }

    return true;
  };

  const validateRepayDebtFields = () => {
    const debtToRepayNum = parseFloat(debtToRepay);
    if (vaultID === "" || debtToRepay === "" || debtToRepayNum < 0) {
      alert("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const validateCollateralFields = () => {
    const collateralAmountNum = parseFloat(collateralAmount);
    if (vaultID === "" || collateralAmount === "" || collateralAmountNum < 0) {
      alert("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const connectWallet = async () => {
    try {
      const principal = await window.ic.infinityWallet.requestConnect({
        whitelist: WHITELIST,
      });
      router.reload();
      const address = principal.toText();
      setConnectedAddress(address);
      console.log(`Connected user's public key:`, principal);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.ic.infinityWallet.disconnect();
      router.reload();
      setIsConnected(false);
      setConnectedAddress(null);
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const fetchUserVaultIds = async () => {
    if (vaultManager !== null && connectedPrincipal !== null) {
      try {
        const vaultIds = await vaultManager.getUserVaultIds(connectedPrincipal);
        setCurrentVaultIds(vaultIds);
      } catch (error) {
        console.error("Error fetching user vault IDs:", error);
      }
    }
  };

  const resetState = () => {
    setVaultID("");
    setSynthUsdAmount("");
    setCollateralAmount("");
    setDebtToRepay("");
    setCurrentVaultDetails(null);
    setCurrentVaultIds([]);
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    resetState();
    if (event.target.value === "Repay Debt") {
      checkAllowance();
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const createVaultManagerActor = async () => {
    try {
      const vaultManager = await window.ic.infinityWallet.createActor({
        canisterId: VAULT_MANAGER_ADDRESS,
        interfaceFactory: vaultManagerIdlFactory,
        host: undefined,
      });
      setVaultManager(vaultManager);
    } catch (error) {
      console.error("Error creating vault manager actor:", error);
    }
  };

  const checkAllowance = async () => {
    if (synBaseService !== null && connectedPrincipal !== null) {
      const allowanceArgs: AllowanceArgs = {
        account: {
          owner: connectedPrincipal,
          subaccount: [],
        },
        spender: {
          owner: Principal.fromText(VAULT_MANAGER_ADDRESS),
          subaccount: [],
        },
      };
      try {
        const allowance = await synBaseService.icrc2_allowance(allowanceArgs);
        console.log(allowance);
        setAllowance(allowance);
      } catch (error) {
        console.error("Error checking allowance:", error);
      }
    }
  };

  const handleApprove = async () => {
    if (synBaseService !== null && connectedPrincipal !== null) {
      const approveArgs: ApproveArgs = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: BigInt(100000000000),
        expected_allowance: [],
        expires_at: [],
        spender: {
          owner: Principal.fromText(VAULT_MANAGER_ADDRESS),
          subaccount: [],
        },
      };

      try {
        const approveResult = await synBaseService.icrc2_approve(approveArgs);
        if ("Ok" in approveResult) {
          const okValue = approveResult["Ok"];
          console.log("Approval successful:", okValue);
          router.reload();
          return true;
        } else if ("Err" in approveResult) {
          const errValue = approveResult["Err"];
          console.error("Approval error:", errValue);
        } else {
          console.error("Invalid approval result:", approveResult);
        }
      } catch (error) {
        console.error("Error during approval:", error);
      }
    }
  };

  const handleGetVaultDetails = async (event: React.FormEvent) => {
    event.preventDefault();
    if (vaultManager !== null) {
      try {
        const vaultId = BigInt(parseInt(vaultID));
        const details = await vaultManager.getVaultDetails(vaultId);
        setCurrentVaultDetails(details);

        const userDebt = await vaultManager.getVaultActualDebt(vaultId);
        setActualUserDebt(userDebt);
      } catch (error) {
        console.error("Error getting vault details:", error);
      }
    }
  };

  const createSynthTokenActor = async () => {
    try {
      const synBaseService = await window.ic.infinityWallet.createActor({
        canisterId: SYNTH_TOKEN_ADDRESS,
        interfaceFactory: synBaseIdlFactory,
        host: undefined,
      });
      setSynBaseService(synBaseService);
    } catch (error) {
      console.error("Error creating synth token actor:", error);
    }
  };

  const handleBorrow = async () => {
    if (validateBorrowFields()) {
      const synthUsdBigInt = BigInt(Math.pow(10, 8) * parseFloat(synthUsdAmount));
      const vaultId = BigInt(parseInt(vaultID));

      if (vaultManager !== null) {
        try {
          const result = await vaultManager.borrow(vaultId, synthUsdBigInt);
          console.log("Borrow result:", result);

          const details = await vaultManager.getVaultDetails(vaultId);
          setCurrentVaultDetails(details);
          console.log("Current vault details:", currentVaultDetails);
        } catch (error) {
          console.error("Error borrowing:", error);
        }
      }
    }
  };

  const handleRepayDebt = async () => {
    if (validateRepayDebtFields()) {
      if (vaultManager !== null) {
        try {
          const vaultId = BigInt(parseInt(vaultID));
          const parsedValue = parseFloat(debtToRepay);
          const debtBigInt =
            (BigInt(Math.pow(10, 8)) * BigInt(Math.round(parsedValue * 10))) /
            BigInt(10);

          const result = await vaultManager.repayDebt(vaultId, debtBigInt, []);
          console.log("Repay result:", result);

          const details = await vaultManager.getVaultDetails(vaultId);
          setCurrentVaultDetails(details);
          console.log("Current vault details:", currentVaultDetails);
        } catch (error) {
          console.error("Error repaying debt:", error);
        }
      }
    }
  };

  const handleAddCollateral = async () => {
    if (validateCollateralFields()) {
      const parsedValue = parseFloat(collateralAmount);
      const collateralBigInt = BigInt(parsedValue * 10 ** 8);
      const vaultId = BigInt(parseInt(vaultID));

      if (vaultManager !== null) {
        try {
          const result = await vaultManager.addCollateral(vaultId, collateralBigInt);
          console.log("Add collateral result:", result);

          const details = await vaultManager.getVaultDetails(vaultId);
          setCurrentVaultDetails(details);
          console.log("Current vault details:", currentVaultDetails);
        } catch (error) {
          console.error("Error adding collateral:", error);
        }
      }
    }
  };

  const handleCreateVault = async (event: React.FormEvent) => {
    event.preventDefault();
    if (vaultManager !== null) {
      try {
        const vaultId = await vaultManager.createVault([]);
        fetchUserVaultIds();
        console.log("Created vault ID:", vaultId);
      } catch (error) {
        console.error("Error creating vault:", error);
      }
    }
  };

  const handleVaultIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    if (/^[0-9]\d*$/.test(inputValue)) {
      setVaultID(inputValue);
    } else {
      setVaultID("");
    }
  };

  const renderForm = () => {
    switch (selectedOption) {
      case "Borrow":
        return (
          <form>
            <div className={styles.formContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultID">
                  Vault ID
                  <input
                    type="text"
                    id="vaultID"
                    name="vaultID"
                    value={vaultID}
                    onChange={handleVaultIDChange}
                    placeholder="0"
                  />
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="synthUsd">
                  synthUsd
                  <input
                    type="number"
                    id="synthUsd"
                    name="synthUsd"
                    value={synthUsdAmount}
                    onChange={(e) => setSynthUsdAmount(e.target.value)}
                    placeholder="0.0"
                  />
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultLtvRatio">
                  Vault LTV Ratio
                  <p>
                    {currentVaultDetails?.vaultLtvRatio !== undefined
                      ? `${Math.round(currentVaultDetails.vaultLtvRatio * 100)}%`
                      : `0%`}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultCurrentCollateral">
                  Vault Current Collateral
                  <p>
                    {currentVaultDetails?.vaultCurrentCollateral !== undefined
                      ? `${currentVaultDetails.vaultCurrentCollateral} CKBTC`
                      : 0}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultCollaterisationRatio">
                  Vault Current Collaterisation Ratio
                  <p>
                    {currentVaultDetails?.vaultLtvRatio !== undefined
                      ? `${Math.round(
                          (1 / currentVaultDetails.vaultLtvRatio) * 100
                        )}%`
                      : `0%`}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="healthFactor">
                  Health Factor
                  <p>0</p>
                </label>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.calculateButton}
                onClick={handleBorrow}
              >
                Borrow
              </button>
              <button
                className={styles.createVaultButton}
                onClick={() => setSelectedOption("Create Vault")}
              >
                Create Vault
              </button>
            </div>
          </form>
        );
      case "Add Collateral":
        return (
          <form>
            <div className={styles.formContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultID">
                  Vault ID
                  <input
                    type="text"
                    id="vaultID"
                    name="vaultID"
                    value={vaultID}
                    onChange={handleVaultIDChange}
                    placeholder="0"
                  />
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="collateralAmount">
                  ckBtc
                  <input
                    type="number"
                    id="collateralAmount"
                    name="collateralAmount"
                    value={collateralAmount}
                    onChange={(e) => setCollateralAmount(e.target.value)}
                    placeholder="0.0"
                  />
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultLtvRatio">
                  Vault LTV Ratio
                  <p>
                    {currentVaultDetails?.vaultLtvRatio !== undefined
                      ? `${Math.round(currentVaultDetails.vaultLtvRatio * 100)}%`
                      : `0%`}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultCurrentCollateral">
                  Vault Current Collateral
                  <p>
                    {currentVaultDetails?.vaultCurrentCollateral !== undefined
                      ? `${currentVaultDetails.vaultCurrentCollateral} CKBTC`
                      : 0}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultCollaterisationRatio">
                  Vault Current Collaterisation Ratio
                  <p>
                    {currentVaultDetails?.vaultLtvRatio !== undefined
                      ? `${Math.round(
                          (1 / currentVaultDetails.vaultLtvRatio) * 100
                        )}%`
                      : `0%`}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="healthFactor">
                  Health Factor
                  <p>0</p>
                </label>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button
                type="button"
                className={styles.calculateButton}
                onClick={handleAddCollateral}
              >
                Add Collateral
              </button>
              <button
                className={styles.createVaultButton}
                onClick={() => setSelectedOption("Create Vault")}
              >
                Create Vault
              </button>
            </div>
          </form>
        );
      case "Create Vault":
        return (
          <form className={styles.formContainer}>
            <div className={styles.inputGroup}>
              <button
                className={styles.createVaultButton}
                onClick={handleCreateVault}
              >
                Create Vault
              </button>
              {currentVaultIds.length > 0 && (
                <div className={styles.vaultIdContainer}>
                  <p className={styles.vaultIdTitle}>Current Vault IDs:</p>
                  <ul className={styles.vaultIdList}>
                    {currentVaultIds.map((vaultId) => (
                      <li
                        key={vaultId.toString()}
                        className={styles.vaultIdItem}
                      >
                        {vaultId.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="vaultLtvRatio">
                Vault LTV Ratio
                <p>
                  {currentVaultDetails?.vaultLtvRatio !== undefined
                    ? `${Math.round(currentVaultDetails.vaultLtvRatio * 100)}%`
                    : `0%`}
                </p>
              </label>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="vaultCurrentCollateral">
                Vault Current Collateral
                <p>
                  {currentVaultDetails?.vaultCurrentCollateral !== undefined
                    ? `${currentVaultDetails.vaultCurrentCollateral} CKBTC`
                    : 0}
                </p>
              </label>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="vaultCollaterisationRatio">
                Vault Current Collaterisation Ratio
                <p>
                  {currentVaultDetails?.vaultLtvRatio !== undefined
                    ? `${Math.round(
                        (1 / currentVaultDetails.vaultLtvRatio) * 100
                      )}%`
                    : `0%`}
                </p>
              </label>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="vaultDebt">
                Vault Debt
                <p>
                  {actualUserDebt !== null
                    ? `${actualUserDebt} SynthUSD`
                    : "Fetching"}
                </p>
              </label>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="vaultID">
                Vault ID
                <input
                  type="text"
                  id="vaultID"
                  name="vaultID"
                  value={vaultID}
                  onChange={handleVaultIDChange}
                  placeholder="0"
                />
              </label>
            </div>
            <div>
              <button
                className={styles.getVaultDetailsButton}
                onClick={handleGetVaultDetails}
              >
                Get Vault Details
              </button>
            </div>
          </form>
        );
      case "Repay Debt":
        return (
          <form>
            <div className={styles.formContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultID">
                  Vault ID
                  <input
                    type="text"
                    id="vaultID"
                    name="vaultID"
                    value={vaultID}
                    onChange={handleVaultIDChange}
                    placeholder="0"
                  />
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="debtToRepay">
                  synthUsd
                  <input
                    type="number"
                    id="debtToRepay"
                    name="debtToRepay"
                    value={debtToRepay}
                    onChange={(e) => setDebtToRepay(e.target.value)}
                    placeholder="0.0"
                  />
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultLtvRatio">
                  Vault LTV Ratio
                  <p>
                    {currentVaultDetails?.vaultLtvRatio !== undefined
                      ? `${Math.round(currentVaultDetails.vaultLtvRatio * 100)}%`
                      : `0%`}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultCurrentCollateral">
                  Vault Current Collateral
                  <p>
                    {currentVaultDetails?.vaultCurrentCollateral !== undefined
                      ? `${currentVaultDetails.vaultCurrentCollateral} CKBTC`
                      : 0}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="vaultCollaterisationRatio">
                  Vault Current Collaterisation Ratio
                  <p>
                    {currentVaultDetails?.vaultLtvRatio !== undefined
                      ? `${Math.round(
                          (1 / currentVaultDetails.vaultLtvRatio) * 100
                        )}%`
                      : `0%`}
                  </p>
                </label>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="healthFactor">
                  Health Factor
                  <p>0</p>
                </label>
              </div>
            </div>
            <div className={styles.actionButtons}>
              {allowance &&
              (allowance.allowance < BigInt(100000000000) ||
                (allowance.expires_at &&
                  allowance.expires_at.length > 0 &&
                  allowance.expires_at[0] / BigInt(1000000) <
                    BigInt(new Date().getTime()))) ? (
                <button
                  type="button"
                  className={styles.approveButton}
                  onClick={handleApprove}
                >
                  Approve
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.repayDebtButton}
                  onClick={handleRepayDebt}
                >
                  Repay Debt
                </button>
              )}
              <button
                className={styles.createVaultButton}
                onClick={() => setSelectedOption("Create Vault")}
              >
                Create Vault
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Head>
        <title>
          Chainvault Finance - Unlock Liquidity: Borrow Against ckbtc |
          Decentralized Crypto Lending
        </title>
        <meta
          name="description"
          content="Chainvault Finance allows you to unlock liquidity by borrowing against your ckbtc holdings. Access stablecoins instantly and maximize your crypto assets. Join the future of decentralized finance today!"
        />
        <meta
          name="keywords"
          content="Chainvault Finance, Chainvault App, Chainvault, Chainvault app, Chainvault finance, Chainvault twitter, Decentralized finance platform, Crypto lending and borrowing, Collateralized loans, Synth tokens, Stablecoin minting, Instant liquidity, Yield farming, Smart contracts, Financial decentralization, Crypto-backed loans, Cryptocurrency protocol, Decentralized liquidity pool, SynthUSD stablecoin, Blockchain assets, Peer-to-peer lending, Yield optimization, DeFi ecosystem, Blockchain technology, Liquidity protocol, Asset-backed loans, Tokenized assets, Yield generation, Crypto investment, Digital currency, Yield farming strategies, DeFi governance, Crypto staking, Crypto portfolio management, Yield farming rewards, Crypto savings accounts, DeFi lending platforms, Yield farming liquidity, Crypto-backed stablecoins, Yield farming risks, Blockchain-based finance, DeFi tokenized assets, Yield farming projects, Automated finance, Crypto liquidity solutions, Liquidity mining, DeFi tokens, Tokenization of assets, Decentralized savings, Decentralized exchange, Synthetic assets, Crypto yield farming, Yield farming platforms, Crypto asset management, Crypto yield optimization, DeFi lending protocols, Crypto finance solutions, DeFi borrowing and lending, Blockchain investment strategies, Yield farming opportunities, DeFi portfolio diversification, DeFi governance tokens, Decentralized finance apps, Crypto investment vehicles, Decentralized lending platforms, Blockchain collateralization, Yield farming strategies and risks, Crypto loan collateral, DeFi liquidity providers, Crypto yield pools, Crypto trading and investment, Decentralized asset management, Cryptocurrency yield farming, Blockchain lending platforms, Crypto yield generation, Crypto portfolio optimization, DeFi asset-backed loans, Decentralized lending and borrowing, Stablecoin creation, Crypto asset diversification, Yield farming security, Blockchain-based savings, Crypto-backed loan collateral, Yield farming projects and rewards, Chainvault Finance updates"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icons/tabicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Chainvault Finance - Unlock Liquidity with ckbtc Holdings"
        />
        <meta
          name="twitter:description"
          content="Unlock liquidity with Chainvault Finance and maximize your crypto assets. Join the future of decentralized finance!"
        />
        <meta
          name="twitter:image"
          content="https://pbs.twimg.com/profile_images/1714692668796923904/n9qKs6od_400x400.jpg"
        />
        <meta name="twitter:site" content="@Chainvault Finance" />
        <meta name="twitter:creator" content="@Chainvault Finance" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Chainvault Finance - Unlock Liquidity with ckbtc Holdings"
        />
        <meta
          property="og:description"
          content="Unlock liquidity with Chainvault Finance and maximize your crypto assets. Join the future of decentralized finance!"
        />
        <meta
          property="og:image"
          content="https://pbs.twimg.com/profile_images/1714692668796923904/n9qKs6od_400x400.jpg"
        />
        <meta property="og:url" content="" />
      </Head>
      <div className={styles.blob}></div>
      {isConnected ? (
        <div className={styles.tableContainer}>
          <div className={styles.headerContainer}>
            <h2 className="text-xl font-semibold">Borrow</h2>
          </div>
          <table id="tableList" className={styles.tableList}>
            <thead>
              <tr>
                <th>COLLATERAL TOKEN</th>
                <th>STABLECOIN</th>
                <th>INTEREST FEE</th>
                <th>LIQUIDATION FEE</th>
                <th>MAX LTV</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CkBTC</td>
                <td>synUSD</td>
                <td>1.5%</td>
                <td>0.5%</td>
                <td>80%</td>
                <td>
                  <button
                    className="bg-green-300 text-black px-4 py-2 rounded-md focus:outline-none"
                    onClick={toggleModal}
                  >
                    Manage Vault
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className={styles.paginationContainer}>
            <div className="text-xs text-gray-400">
              Showing 1 to 10 of 40 entries
            </div>
            <div className="flex space-x-2">
              <button className="bg-gray-600 text-gray-400 px-3 py-1 rounded-md focus:outline-none">
                Previous
              </button>
              <button className="bg-gray-600 text-gray-400 px-3 py-1 rounded-md focus:outline-none">
                1
              </button>
              <button className="bg-gray-600 text-gray-400 px-3 py-1 rounded-md focus:outline-none">
                2
              </button>
              <button className="bg-gray-600 text-gray-400 px-3 py-1 rounded-md focus:outline-none">
                Next
              </button>
            </div>
          </div>

          {isModalOpen && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalContent}>
                <div className={styles.modalNavbar}>
                  <div className={styles.modalDropdown}>
                    <select
                      value={selectedOption}
                      onChange={handleOptionChange}
                    >
                      <option className={styles.options}>Borrow</option>
                      <option className={styles.options}>Add Collateral</option>
                      <option className={styles.options}>Create Vault</option>
                      <option className={styles.options}>Repay Debt</option>
                    </select>
                    <span className={styles.arrow}>▼</span>
                  </div>
                  <div className={styles.closeIconContainer}>
                    <i
                      className={`fa fa-times-circle ${styles.closeIcon}`}
                      onClick={toggleModal}
                    ></i>
                  </div>
                </div>
                <div className={styles.modalContainer}>{renderForm()}</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.notConnected}>
          <h1>Wallet Not Connected</h1>
          <p>
            Download and get started for free with{" "}
            <Link href="https://wallet.bitfinity.network/" target="_blank">
              BitFinity Wallet
            </Link>{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default Borrow;
