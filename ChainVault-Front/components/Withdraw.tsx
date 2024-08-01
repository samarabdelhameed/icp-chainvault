import styles from "../assets/styles/Withdraw.module.css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { encodeIcrcAccount } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import { idlFactory as depositIdlFactory } from "../deposit.did";
import { idlFactory as vaultManagerIdlFactory } from "../vaultmanager.did.js";
import { _SERVICE as DepositModule } from "../deposit.did(t)";
import { _SERVICE as VaultManagerService } from "../vaultmanager(ts).did";
import { Account } from "@/synbase(t).did";
import Head from "next/head";

const DEPOSIT_MODULE_ADDRESS = "ivtqt-gqaaa-aaaal-qcdra-cai";
const VAULT_MANAGER_ADDRESS = "isswh-liaaa-aaaal-qcdrq-cai";
const INITIAL_BTC_DEPOSIT_ADDRESS = "Click Get Deposit Address";

const Withdraw = () => {
  // State Variables
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpenDepositCkBTC, setIsModalOpenDepositCkBTC] = useState(false);
  const [isModalOpenDepositBTC, setIsModalOpenDepositBTC] = useState(false);
  const [assets, setAssets] = useState([]);
  const [connectedPrincipal, setConnectedPrincipal] = useState<Principal | null>(null);
  const [encodedAccount, setEncodedAccount] = useState("");
  const [vaultID, setVaultID] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [depositModule, setDepositModule] = useState<DepositModule | null>(null);
  const [vaultManager, setVaultManager] = useState<VaultManagerService | null>(null);
  const [btcDepositAddress, setBtcDepositAddress] = useState<string>(INITIAL_BTC_DEPOSIT_ADDRESS);
  const [loadingDepositAddress, setLoadingDepositAddress] = useState(false);
  const [currentUserBalance, setUserBalance] = useState<string | null>(null);

  const router = useRouter();

  // Effect Hooks
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const isConnected = await window.ic.infinityWallet.isConnected();
        const userAssets = await window.ic.infinityWallet.getUserAssets();
        console.log("User's list of tokens/assets", userAssets);
        setIsConnected(isConnected);
        setAssets(userAssets);

        if (isConnected) {
          const principal = await window.ic.infinityWallet.getPrincipal();
          setConnectedPrincipal(principal);
          const address = principal.toText();
          setConnectedAddress(address);
          setEncodedAccount(encodeIcrcAccount({
            owner: Principal.fromText(DEPOSIT_MODULE_ADDRESS),
            subaccount: padPrincipalWithZeros(principal.toUint8Array()),
          }));
          await createDepositModuleActor();
          await createVaultManagerActor();
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  useEffect(() => {
    const fetchUserBalance = async () => {
      if (depositModule && connectedPrincipal) {
        const balance = await depositModule.getBalance(connectedPrincipal);
        const adjustedBalance = adjustDecimals(balance);
        setUserBalance(adjustedBalance.toString());
      }
    };

    fetchUserBalance();
  }, [depositModule, connectedPrincipal]);

  // Functions
  const toggleModalDepositBTC = () => {
    setBtcDepositAddress(INITIAL_BTC_DEPOSIT_ADDRESS);
    setIsModalOpenDepositBTC(!isModalOpenDepositBTC);
  };

  const toggleModalDepositCkBTC = () => {
    setIsModalOpenDepositCkBTC(!isModalOpenDepositCkBTC);
  };

  const createDepositModuleActor = async () => {
    try {
      const depositModule = await window.ic.infinityWallet.createActor({
        canisterId: DEPOSIT_MODULE_ADDRESS,
        interfaceFactory: depositIdlFactory,
        host: undefined,
      });

      setDepositModule(depositModule);
    } catch (error) {
      console.error("Error creating deposit module actor:", error);
    }
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

  const adjustDecimals = (amount: bigint) => {
    const decimals = BigInt(Math.pow(10, 8));
    return Number((amount * decimals) / decimals) / 100000000;
  };

  const handleGetDepositAddress = async () => {
    if (depositModule && connectedPrincipal) {
      try {
        setLoadingDepositAddress(true);
        const address = await depositModule.getBtcDepositAddress(connectedPrincipal);
        setBtcDepositAddress(address);
      } catch (error) {
        console.error("Error getting deposit address:", error);
        setBtcDepositAddress("Error getting address");
      } finally {
        setLoadingDepositAddress(false);
      }
    }
  };

  const handleUpdateBtcBalance = async () => {
    if (depositModule && connectedPrincipal) {
      try {
        setLoadingDepositAddress(true);
        const updateResult = await depositModule.updateBalance(connectedPrincipal);
        if ("Err" in updateResult) {
          setBtcDepositAddress("Error updating balance");
          console.log(updateResult);
        } else {
          setBtcDepositAddress("BTC balance updated");
        }
      } catch (error) {
        console.error("Error updating balance:", error);
        setBtcDepositAddress("Error updating balance");
      } finally {
        setLoadingDepositAddress(false);
      }
    }
  };

  const padPrincipalWithZeros = (blob: Uint8Array) => {
    const newUint8Array = new Uint8Array(32);
    newUint8Array.set(blob);
    return newUint8Array;
  };

  const copyAddressToClipboard = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress)
        .then(() => alert("Address copied to clipboard"))
        .catch(error => console.error("Error copying address to clipboard:", error));
    }
  };

  const validateFields = () => {
    if (!vaultID || !address || !amount) {
      alert("Please fill in all required fields");
      return false;
    }
    if (parseInt(amount) < 0) {
      alert("Amount should not be negative");
      return false;
    }
    return true;
  };

  const handleWithdraw = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateFields() && vaultManager) {
      try {
        const vaultIdBigInt = BigInt(parseInt(vaultID));
        const parsedAmount = parseFloat(amount);
        const amountToWithdraw = (BigInt(Math.pow(10, 8)) * BigInt(Math.round(parsedAmount * 10))) / BigInt(10);
        const toAccount: Account = {
          owner: Principal.fromText(address),
          subaccount: [],
        };

        console.log(await vaultManager.withdrawCollateral(vaultIdBigInt, amountToWithdraw, toAccount));
      } catch (error) {
        console.error("Error occurred during withdrawal:", error);
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

  return (
    <div className={styles.body}>
      <Head>
        <title>SynthiFy Finance - Manage Profile and Withdraw Assets</title>
        <meta
          name="description"
          content="SynthiFy Finance allows you to unlock liquidity by borrowing against your ckbtc holdings. Access stablecoins instantly and maximize your crypto assets. Join the future of decentralized finance today!"
        />
        <meta
          name="keywords"
          content="SynthiFy Finance, SynthiFy App, synthify, synthify app, synthify finance, synthify twitter, Decentralized finance platform, Crypto lending and borrowing, Collateralized loans, Synth tokens, Stablecoin minting, Instant liquidity, Yield farming, Smart contracts, Financial decentralization, Crypto-backed loans, Cryptocurrency protocol, Decentralized liquidity pool, SynthUSD stablecoin, Blockchain assets, Peer-to-peer lending, Yield optimization, DeFi ecosystem, Blockchain technology, Liquidity protocol, Asset-backed loans, Tokenized assets, Yield generation, Crypto investment, Digital currency, Yield farming strategies, DeFi governance, Crypto staking, Crypto portfolio management, Yield farming rewards, Crypto savings accounts, DeFi lending platforms, Yield farming liquidity, Crypto-backed stablecoins, Yield farming risks, Blockchain-based finance, DeFi tokenized assets, Yield farming projects, Automated finance, Crypto liquidity solutions, Liquidity mining, DeFi tokens, Tokenization of assets, Decentralized savings, Decentralized exchange, Synthetic assets, Crypto yield farming, Yield farming platforms, Crypto asset management, Crypto yield optimization, DeFi lending protocols, Crypto finance solutions, DeFi borrowing and lending, Blockchain investment strategies, Yield farming opportunities, DeFi portfolio diversification, DeFi governance tokens, Decentralized finance apps, Crypto investment vehicles, Decentralized lending platforms, Blockchain collateralization, Yield farming strategies and risks, Crypto loan collateral, DeFi liquidity providers, Crypto yield pools, Crypto trading and investment, Decentralized asset management, Cryptocurrency yield farming, Blockchain lending platforms, Crypto yield generation, Crypto portfolio optimization, DeFi asset-backed loans, Decentralized lending and borrowing, Stablecoin creation, Crypto asset diversification, Yield farming security, Blockchain-based savings, Crypto-backed loan collateral, Yield farming projects and rewards, SynthiFy Finance updates"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icons/tabicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="SynthiFy Finance - Unlock Liquidity with ckbtc Holdings"
        />
        <meta
          name="twitter:description"
          content="Unlock liquidity with SynthiFy Finance and maximize your crypto assets. Join the future of decentralized finance!"
        />
        <meta
          name="twitter:image"
          content="https://pbs.twimg.com/profile_images/1714692668796923904/n9qKs6od_400x400.jpg"
        />
        <meta name="twitter:site" content="@SynthiFyFinance" />
        <meta name="twitter:creator" content="@SynthiFyFinance" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SynthiFy Finance - Unlock Liquidity with ckbtc Holdings"
        />
        <meta
          property="og:description"
          content="Unlock liquidity with SynthiFy Finance and maximize your crypto assets. Join the future of decentralized finance!"
        />
        <meta
          property="og:image"
          content="https://pbs.twimg.com/profile_images/1714692668796923904/n9qKs6od_400x400.jpg"
        />
        <meta property="og:url" content="https://synthifyapp.com/" />
      </Head>

      <div className={styles.blob}></div>

      {isConnected ? (
        <div className={styles.container}>
          <div className={styles.formContainer}>
          <h2 className="text-2xl font-bold mb-2">Withdraw</h2>
          <p className="text-lg font-medium text-gray-300 mb-4">Current Deposited Balance In Module: 0 CKBTC</p>
            <form onSubmit={handleWithdraw}>
              <input
                type="number"
                name="VaultID"
                id="VaultID"
                className={styles.formInput}
                value={vaultID}
                onChange={handleVaultIDChange}
                placeholder="Enter VaultID"
              />
              <input
                type="text"
                name="address"
                id="address"
                className={styles.formInput}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
              />
              <input
                type="number"
                name="amount"
                id="amount"
                className={styles.formInput}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />

              <div className="flex justify-center space-x-4 mt-8">
                <button type="button" className={styles.formButton} onClick={toggleModalDepositCkBTC}>
                  Deposit CkBTC
                </button>
                {isModalOpenDepositCkBTC && (
                  <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                      <i
                        className={`fa fa-times-circle ${styles.closeIcon}`}
                        onClick={toggleModalDepositCkBTC}
                      ></i>
                      <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                          <p>Deposit your ckbtc to the below address.</p>
                          <h3>{encodedAccount}</h3>
                        </div>
                      </div>

                      <div className={styles.modalActions}>
                        <button className={styles.generalButton}>Update Deposits</button>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className={styles.formButton}>
                  Submit
                </button>
                <button type="button" className={styles.formButton} onClick={toggleModalDepositBTC}>
                  Deposit BTC
                </button>
                {isModalOpenDepositBTC && (
                  <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent}>
                      <i
                        className={`fa fa-times-circle ${styles.closeIcon}`}
                        onClick={toggleModalDepositBTC}
                      ></i>
                      <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                          <h3>
                            {loadingDepositAddress ? "Loading..." : btcDepositAddress}
                          </h3>
                          <br />
                          <br />
                        </div>

                        <div className={styles.modalActions}>
                          <button
                            className={styles.generalButton}
                            onClick={handleGetDepositAddress}
                          >
                            Get Deposit Address
                          </button>
                          <br />
                          <button
                            className={styles.generalButton}
                            onClick={handleUpdateBtcBalance}
                          >
                            Update Deposit Address
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className={styles.notConnected}>
          <h1>Wallet Not Connected</h1>
          <p>
            Download and get started for free with{" "}
            <Link href="https://wallet.bitfinity.network/" target="_blank">
              BitFinity Wallet
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
