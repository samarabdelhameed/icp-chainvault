import styles from "../assets/styles/Navbar.module.css";
import Link from "next/link";
import { Principal } from "@dfinity/principal";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const VAULT_MANAGER_ADDRESS = "isswh-liaaa-aaaal-qcdrq-cai";
const SYNTH_TOKEN_ADDRESS = "i3r53-5aaaa-aaaal-qcdqa-cai";
const SYNTH_MINTER_ADDRESS = "i4q3p-qyaaa-aaaal-qcdqq-cai";
const DEPOSIT_MODULE_ADDRESS = "ivtqt-gqaaa-aaaal-qcdra-cai";

const WHITELIST = [
  VAULT_MANAGER_ADDRESS,
  SYNTH_TOKEN_ADDRESS,
  SYNTH_MINTER_ADDRESS,
  DEPOSIT_MODULE_ADDRESS,
];

const Navbar = () => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState<{ name: string; balance: number }[]>([]);

  const router = useRouter();

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
          const address = principal.toText();
          setConnectedAddress(address);
          console.log("The connected user's public key is:", principal);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const principal = await window.ic.infinityWallet.requestConnect({
        whitelist: WHITELIST,
      });
      router.reload();
      const address = principal.toText();
      setConnectedAddress(address);
      console.log("The connected user's public key is:", principal);
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const copyAddressToClipboard = () => {
    if (connectedAddress) {
      navigator.clipboard
        .writeText(connectedAddress)
        .then(() => {
          alert("Address copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying address to clipboard:", error);
        });
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarTitle}>ChainVault</div>
      <div className={styles.navbarLinks}>
        <Link
          href="/documents"
          className={`${styles.navbarLink} ${
            router.pathname === "/documents" ? styles.activeLink : ""
          }`}
        >
          Documents
        </Link>

        <Link
          href="/app"
          className={`${styles.navbarLink} ${
            router.pathname === "/app" ? styles.activeLink : ""
          }`}
        >
          Borrow
        </Link>

        <Link
          href="/withdraw"
          className={`${styles.navbarLink} ${
            router.pathname === "/withdraw" ? styles.activeLink : ""
          }`}
        >
          Withdraw
        </Link>
      </div>

      {isConnected ? (
        <div className={styles.dropdownContainer}>
          {assets.length > 0 ? (
            <div className={styles.selectContainer}>
              <select className={styles.selectElement} name="assets" id="assets">
                {assets.map((asset, index) => (
                  <option key={index} value={asset.name}>
                    {asset.name} {asset.balance / 100000000}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p>No assets owned</p>
          )}

          <button className={styles.connectButton} onClick={toggleModal}>
            {connectedAddress ? `${connectedAddress.slice(0, 8)}... ` : ""}
            <i className="fa fa-caret-down"></i>
          </button>
          {isModalOpen && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalContent}>
                <i
                  className={`fa fa-times-circle ${styles.closeIcon}`}
                  onClick={toggleModal}
                ></i>
                <div className={styles.modalContainer}>
                  <div className={styles.modalHeader}>
                    <h3>{connectedAddress}</h3>
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.copyButton} onClick={copyAddressToClipboard}>
                      <i className="fa fa-copy"></i> Copy Address
                    </button>
                    <button
                      className={styles.disconnectButton}
                      onClick={() => {
                        disconnectWallet();
                        toggleModal();
                      }}
                    >
                      <i className="fa fa-sign-out"></i> Disconnect Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          className={styles.connectButton}
          type="button"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default Navbar;
