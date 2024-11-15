import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../assets/styles/Borrow.module.css";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { Opt } from "azle";
import { Principal } from "@dfinity/principal";

import { idlFactory as vaultManageridlFactory } from "../vaultmanager.did.js";
import { synBaseIdlFactory } from "../synBase.did";
import {
  _SERVICE as vaultmanager_SERVICE,
  IndividualVaultData,
  AllowanceArgs,
} from "@/vaultmanager(ts).did";
import { _SERVICE as synBase_SERVICE } from "@/synbase(t).did";

import { Account } from "@/vaultmanager(ts).did";
import { Allowance } from "@/vaultmanager(ts).did";
import { ApproveArgs } from "@/synbase(t).did";

const Borrow = () => {
  const [vaultID, setVaultID] = useState("");
  const [synthUsdAmount, setsynthUsdAmount] = useState("");
  const [collatAmnt, setcollatAmnt] = useState("");
  const [ckBtcAmount, setckBtcAmount] = useState("");
  const [Currency, setCurrency] = useState("sUSD");
  const [selectedPill, setSelectedPill] = useState("");
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Borrow");
  const [backendData, setBackendData] = useState("");
  const [vaultManager, setVaultManager] = useState<vaultmanager_SERVICE | null>(
    null
  );
  const [currentVautDetails, setCurrentVaultDetails] =
    useState<IndividualVaultData | null>(null);
  const [connectPrincipal, setConnectedPrincipal] = useState<Principal | null>(
    null
  );
  const [currentVaultIds, setCurrentVaultIds] = useState<Array<bigint>>([]);
  const [Allowance, setAllowance] = useState<Allowance | null>(null);
  const [synBaseAddress, setSynBaseAddress] = useState<synBase_SERVICE | null>(
    null
  );
  const [debtToRepay, setDebtToRepay] = useState("");

  const [actualUserDebt, setActualUserDebt] = useState<number | null>();

  const vaultManagerAddress = "isswh-liaaa-aaaal-qcdrq-cai";

  const synthTokenAddress = "i3r53-5aaaa-aaaal-qcdqa-cai";

  const synthMinterAddress = "i4q3p-qyaaa-aaaal-qcdqq-cai";

  const whitelist = [
    vaultManagerAddress,
    synthTokenAddress,
    synthMinterAddress,
  ];

  const router = useRouter();

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const result = await window.ic.infinityWallet.isConnected();
        setIsConnected(result);

        if (result) {
          const publicKey = await window.ic.infinityWallet.getPrincipal();
          setConnectedPrincipal(publicKey);
          const address = publicKey.toText();
          setConnectedAddress(address);
          await VaultManagercreateActor();
          await SyntheTokenCreateActor();
          //
          console.log(`The connected user's public key  sis:`, publicKey);
        }
      } catch (e) {
        console.log("Error checking wallet connection:", e);
      }
    };

    checkWalletConnection();
  }, []);

  useEffect(() => {
    // Call getuserIdVaults whenever selectedOption changes to "Create Vault"
    if (selectedOption === "Create Vault" && vaultManager !== null) {
      getuserIdVaults();
    }
  }, [selectedOption, vaultManager]);

  //@todo: Change the use effect condition
  useEffect(() => {
    const main = async () => {
      await checkAllowance();
    };

    main();
  }, []);

  //   useEffect(()=> {
  //     const main = async() =>{
  //       await checkCurrentVaultIds()
  //     };
  //     main();
  //   },[selectedOption])

  // const checkCurrentVaultIds = async() => {

  //   if(vaultManager !== null && vaultID !== ""){
  //     const vaultID
  //   setCurrentVaultDetails(await vaultManager.getVaultDetails(vaultId))
  //   }

  // }
  const validateFields1 = () => {
    const synthUsdAmountNum = parseFloat(synthUsdAmount);

    if (vaultID === "" || isNaN(synthUsdAmountNum) || synthUsdAmountNum < 0) {
      alert("Please fill in all required fields correctly");
      return false;
    }

    return true;
  };

  const validateFields2 = () => {
    const debtToRepayNum = parseFloat(debtToRepay);
    if (vaultID === "" || debtToRepay === "" || debtToRepayNum < 0) {
      alert("Please fill in all required fields");
      return false;
    }
    return true;
  };
  const validateFields3 = () => {
    const collatAmntNum = parseFloat(collatAmnt);
    if (vaultID === "" || collatAmnt === "" || collatAmntNum < 0) {
      alert("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const connectWallet = async () => {
    try {
      const publicKey = await window.ic.infinityWallet.requestConnect({
        whitelist,
      });
      router.reload();
      const address = publicKey.toText();
      setConnectedAddress(address);
      console.log(`The connected user's public key is:`, publicKey);
    } catch (e) {
      console.log("Error connecting wallet:", e);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.ic.infinityWallet.disconnect();
      router.reload();
      setIsConnected(false);
      setConnectedAddress(null);
      console.log("Wallet disconnected");
    } catch (e) {
      console.log("Error disconnecting wallet:", e);
    }
  };

  const getuserIdVaults = async () => {
    if (vaultManager !== null && connectPrincipal !== null) {
      try {
        const vaultids = await vaultManager.getUserVaultIds(connectPrincipal);
        setCurrentVaultIds(vaultids);
      } catch (e) {
        console.log("error in getting user id vaults", e);
      }
    }
  };

  const resetState = () => {
    setVaultID("");
    setsynthUsdAmount("");
    setcollatAmnt("");
    setCurrentVaultDetails(null);
    setCurrentVaultIds([]);
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    resetState();
    if (e.target.value === "Repay Debt") {
      checkAllowance();
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const VaultManagercreateActor = async () => {
    try {
      const _vaultManager = await window.ic.infinityWallet.createActor({
        canisterId: vaultManagerAddress,
        interfaceFactory: vaultManageridlFactory,
        host: undefined,
      });
      setVaultManager(_vaultManager);
    } catch (e) {
      console.log("Error creating actor:", e);
    }
  };

  const checkAllowance = async () => {
    if (synBaseAddress !== null && connectPrincipal !== null) {
      const allowance_args: AllowanceArgs = {
        account: {
          owner: connectPrincipal,
          subaccount: [],
        },
        spender: {
          owner: Principal.fromText(vaultManagerAddress),
          subaccount: [],
        },
      };
      console.log("before allowance");
      const allowance = await synBaseAddress.icrc2_allowance(allowance_args);
      console.log(allowance);
      setAllowance(allowance);
    }
  };

  const handleApprove = async () => {
    console.log(
      `Checking synabse ${synBaseAddress} and connnectPrincipal ${connectPrincipal}`
    );
    if (synBaseAddress !== null && connectPrincipal !== null) {
      console.log("heeeeere");
      const approve_args: ApproveArgs = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: BigInt(100000000000),
        expected_allowance: [],
        expires_at: [],
        spender: {
          owner: Principal.fromText(vaultManagerAddress),
          subaccount: [],
        },
      };

      const approveResult = await synBaseAddress.icrc2_approve(approve_args);
      if ("Ok" in approveResult) {
        // It's of type 'Ok'
        const okValue = approveResult["Ok"]; // You can access the 'Ok' property
        console.log("Ok result:", okValue);
        router.reload();
        return true;
      } else if ("Err" in approveResult) {
        // It's of type 'Err'
        const errValue = approveResult["Err"]; // You can access the 'Err' property
        console.log("Err result:", errValue);
      } else {
        // It's neither 'Ok' nor 'Err'
        console.log("Invalid result:", approveResult);
      }
    }
  };

  const handleGetVaultDetails = async (e) => {
    e.preventDefault();
    if (vaultManager !== null) {
      const _vaultId = BigInt(parseInt(vaultID));
      const data = await vaultManager.getVaultDetails(_vaultId);
      setCurrentVaultDetails(data);

      const actualUserDebt = await vaultManager.getVaultActualDebt(_vaultId);
      setActualUserDebt(actualUserDebt);
    }
  };
  const SyntheTokenCreateActor = async () => {
    try {
      const _synthBase = await window.ic.infinityWallet.createActor({
        canisterId: synthTokenAddress,
        interfaceFactory: synBaseIdlFactory,
        host: undefined,
      });
      setSynBaseAddress(_synthBase);
    } catch (e) {
      console.log("Error creating synthActor:", e);
    }
  };

  const handleBorrow = async () => {
    if (validateFields1()) {
      if (synthUsdAmount !== null) {
        console.log("collatAmount", parseFloat(synthUsdAmount));
        const decimalAdjustedsUsd = BigInt(
          Math.pow(10, 8) * parseFloat(synthUsdAmount)
        );
        console.log("decimal adjusts", decimalAdjustedsUsd);

        const vaultId = BigInt(parseInt(vaultID));

        if (vaultManager !== null) {
          try {
            const result = await vaultManager.borrow(
              vaultId,
              decimalAdjustedsUsd
            );
            console.log(result);

            setCurrentVaultDetails(await vaultManager.getVaultDetails(vaultId));
            console.log(currentVautDetails);
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  };
  //change1
  //@bug here = if the valuues in the field are not entered it should not allow you to click buttons
  const handleRepayDebt = async () => {
    if (validateFields2()) {
      if (vaultManager !== null) {
        try {
          const _vaultId = BigInt(parseInt(vaultID));

          const parsedValue = parseFloat(debtToRepay);
          const _debtToRepay =
            (BigInt(Math.pow(10, 8)) * BigInt(Math.round(parsedValue * 10))) /
            BigInt(10);

          console.log(_vaultId);

          const result = await vaultManager.repayDebt(
            _vaultId,
            _debtToRepay,
            []
          );
          console.log(result);

          setCurrentVaultDetails(await vaultManager.getVaultDetails(_vaultId));
          console.log(currentVautDetails);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const handleaddCollateral = async () => {
    if (validateFields3()) {
      console.log("collatAmount", parseFloat(collatAmnt));

      const parsedValue = parseFloat(collatAmnt);
      console.log("parse values", parsedValue);
      const decimalAdjusted = BigInt(parsedValue * 10 ** 8);
      console.log("decimal adjusts", decimalAdjusted);

      const vaultId = BigInt(parseInt(vaultID));
      if (vaultManager !== null) {
        try {
          const result = await vaultManager.addCollateral(
            vaultId,
            decimalAdjusted
          );
          console.log(result);

          setCurrentVaultDetails(await vaultManager.getVaultDetails(vaultId));
          console.log(currentVautDetails);
        } catch (e) {
          //@todo: show the error messaeg e somewhere
          console.log(e);
        }
      }
    }
  };

  const handleCreateVaultFunction = async (e) => {
    e.preventDefault();
    if (vaultManager !== null) {
      try {
        const vaultId = await vaultManager.createVault([]);
        getuserIdVaults();
        console.log(vaultId);
      } catch (e) {
        console.log("Error occured when creating vault:", e);
      }
    }
  };

  const handleVaultIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Check if the input is a positive integer
    if (/^[0-9]\d*$/.test(inputValue)) {
      setVaultID(inputValue);
    } else {
      // If not a positive integer, you can display an error message or handle it in another way
      // For now, we clear the input
      setVaultID("");
    }
  };

  const handleVaultFunction = async () => {};

  const getForm = () => {
    switch (selectedOption) {
      //asset.synthUsdAmount this will be userAssets 1st element  userAssets[0]
      case "Borrow":
        //  setVaultID(0);
        return (
          <form>
            <div className="mt-6 space-y-4">
                <div>
                   <label htmlFor="sUsd">
        
                      <div className={styles.formGroup2}>
                      <label className={styles.label}> Vault ID</label>
                        <input
                          type="text"
                          id="vaultID"
                          name="vaultID"
                          value={vaultID}
                          onChange={handleVaultIDChange}
                          placeholder="0"
                          className={styles.input2}
                        />
                      </div>
                    </label>
                    <div className={styles.gasFee}></div>
                  
                </div>
                <div>
                   
                      <div className={styles.inputGroup2}>
                      <label htmlFor="sUsd" className={styles.label}>  synthUsd</label>
                        <input
                          type="number"
                          id="synthUsd"
                          name="synthUsd"
                          value={synthUsdAmount}
                          onChange={(e) => setsynthUsdAmount(e.target.value)}
                          placeholder="0.0"
                          className={styles.input2}

                        />
                      </div>
                    
                    <div className={styles.gasFee}></div>
                  
                </div>
            
              <div className={styles.rightbox1}>
                <div className={styles.input3Container}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault LTV Ratio
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultLtvRatio !== undefined
                          ? `${Math.round(
                              currentVautDetails.vaultLtvRatio * 100
                            )}%`
                          : `0%`}
                      </p>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Current Collateral
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultCurrentCollateral !== undefined
                          ? `${currentVautDetails.vaultCurrentCollateral} CKBTC`
                          : 0}
                      </p>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Current Collaterisation Ratio
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultLtvRatio !== undefined
                          ? `${Math.round(
                              (1 / currentVautDetails.vaultLtvRatio) * 100
                            )}%`
                          : `0%`}
                      </p>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Health Factor
                    </label>
                    <div className={styles.TextRight}>
                      <p>0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button
                type="button"
                className={styles.button2}
                onClick={handleBorrow}
              >
                Borrow
              </button>
              <button
                className={styles.button3}
                onClick={() => setSelectedOption("Create Vault")}
                style={{ marginTop: "10px" }}
              >
                Create Vault
              </button>
            </div>
          </form>
        );
      //asset.ckbtAmount  this will be userAssets 2n element  userAssets[1]
      case "Add Collateral":
        // setVaultID(0);
        return (
          <form>
         <div className="mt-6 space-y-4">


                <div>
                    <label htmlFor="sUsd">
                      <div className={styles.formGroup2}>
                      <label className={styles.label}> Vault ID</label>
                        <input
                          type="text"
                          id="vaultID"
                          name="vaultID"
                          value={vaultID}
                          onChange={handleVaultIDChange}
                          placeholder="0"
                          className={styles.input2}

                        />
                      </div>
                    </label>
                    <div className={styles.gasFee}>
  
                    </div>
                  
                </div>
                <div>
                    <div className={styles.inputGroup2}>
                      
                        <label className={styles.label}> ckBtc</label>

                      <input
                        type="number"
                        id="ckBtc"
                        name="ckBtc"
                        value={collatAmnt}
                        onChange={(e) => setcollatAmnt(e.target.value)}
                        placeholder="0.0"
                        className={styles.input2}

                      />
                    </div>
                    <div className={styles.gasFee}>
  
                    </div>
                  
                </div>
              
              
              <div className={styles.rightbox1}>
                <div className={styles.input3Container}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault LTV Ratio
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultLtvRatio !== undefined
                          ? `${Math.round(
                              currentVautDetails.vaultLtvRatio * 100
                            )} %`
                          : `0%`}
                      </p>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Current Collateral
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultCurrentCollateral !== undefined
                          ? `${currentVautDetails.vaultCurrentCollateral} CKBTC`
                          : 0}
                      </p>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Current Collaterisation Ratio
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultLtvRatio !== undefined
                          ? `${Math.round(
                              (1 / currentVautDetails.vaultLtvRatio) * 100
                            )} %`
                          : `0%`}
                      </p>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Health Factor
                    </label>
                    <div className={styles.TextRight}>
                      <p>0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                type="button"
                className={styles.button2}
                onClick={handleaddCollateral}
              >
                Add Collateral
              </button>
              <button
                className={styles.button3}
                onClick={() => setSelectedOption("Create Vault")}
                style={{ marginTop: "10px" }}
              >
                Create Vault
              </button>
            </div>
          </form>
        );
      //asset.ckbtcAmount
      case "Create Vault":
        //  setVaultID(0);
        return (
          <form className={styles.formCont}>
            <div className={styles.leftbox}>
              <div className={styles.input24Container}>
                <div className={styles.createWalletContainer}>
                  <button
                    className={styles.createWalletButton2}
                    onClick={handleCreateVaultFunction} //or use  onClick={handleCreateVaultFunction}
                  >
                    Create Vault
                  </button>
                  {currentVaultIds.length > 0 && (
                    <div
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "2px solid #0f0d3b",
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        fontFamily: "Arial, sans-serif",
                        display: "inline-block",
                        padding: "5px",
                        marginTop: "20px",
                        width: "200px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "grey white",
                        MsOverflowStyle: "none",
                      }}
                    >
                      <style>
                        {`
        ::-webkit-scrollbar {
          width: 12px; // set scrollbar width
        }

        ::-webkit-scrollbar-track {
          background: white; // set track background color
        }

        ::-webkit-scrollbar-thumb {
          background-color: grey; // set thumb color
          border-radius: 6px; // set thumb border radius
          border: 3px solid white; // set thumb border color
        }
        `}
                      </style>
                      <p
                        style={{
                          fontSize: "18px",
                          marginBottom: "10px",
                          textAlign: "center",
                        }}
                      >
                        Current Vault IDs:
                      </p>
                      <ul
                        style={{
                          listStyleType: "none",
                          padding: "0",
                          textAlign: "center",
                        }}
                      >
                        {currentVaultIds.map((vaultId) => (
                          <li
                            key={vaultId.toString()}
                            style={{
                              fontSize: "16px",
                              marginBottom: "5px",
                              padding: "5px 10px",
                              backgroundColor: "#fff",
                              border: "0px solid #9793d9",
                              borderRadius: "3px",
                              transition:
                               "background-color 0.3s, transform 0.3s",
                              margin: "10px 5px",
                              color: "black",
                            }}
                          >
                            {vaultId.toString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {backendData && (
                    <p className={styles.backendData}>{backendData}</p>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.rightboxes2}>
              <div>
                <div className={styles.input3Container2}>
                  <div className={styles.inputGroup31}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault LTV Ratio
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultLtvRatio !== undefined
                          ? `${Math.round(
                              currentVautDetails.vaultLtvRatio * 100
                            )}%`
                          : `0%`}
                      </p>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Current Collateral
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultCurrentCollateral !== undefined
                          ? `${currentVautDetails.vaultCurrentCollateral} CKBTC`
                          : 0}
                      </p>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Current Collaterisation Ratio
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultLtvRatio !== undefined
                          ? `${Math.round(
                              (1 / currentVautDetails.vaultLtvRatio) * 100
                            )}%`
                          : `0%`}
                      </p>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Debt
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {actualUserDebt !== null
                          ? `${actualUserDebt} SynthUSD`
                          : "Fetching"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.input3Container2}>
                  <label htmlFor="sUsd">
                    <div className={styles.inputGroup31}>
                      Vault ID
                      <input
                        type="text"
                        id="vaultID"
                        name="vaultID"
                        value={vaultID}
                        onChange={handleVaultIDChange}
                        placeholder="0"
                      />
                    </div>
                  </label>
                  <div className={styles.gasFee}></div>
                </div>
              </div>
              <div>
                <button
                  className={styles.button3}
                  onClick={handleGetVaultDetails}
                >
                  Get Vault Details
                </button>
              </div>
            </div>
          </form>
        );
      //asset.ckbtcAmount
      case "Repay Debt":
        //  setVaultID(0);
        return (
          <form>
            <div className="mt-6 space-y-4">

                <div>
                  <label htmlFor="sUsd">
                      <div className={styles.inputGroup2}>
                      <label  className={styles.label}>  Vault ID</label>
                        <input
                          type="text"
                          id="vaultID"
                          name="vaultID"
                          value={vaultID}
                          onChange={handleVaultIDChange}
                          placeholder="0"
                          className={styles.input2}

                        />
                      </div>
                    </label>
                    <div className={styles.gasFee}>
  
                    </div>

                  
                </div>

                <div>
                    <label htmlFor="sUsd">
                      <div className={styles.inputGroup2}>
                      <label className={styles.label}> synthUsd</label>
                        <input
                          type="number"
                          id="synthUsd"
                          name="synthUsd"
                          value={debtToRepay}
                          onChange={(e) => setDebtToRepay(e.target.value)}
                          placeholder="0.0"
                          className={styles.input2}

                        />
                      </div>
                    </label>
                    <div className={styles.gasFee}>
                    </div>
                  
                </div>



              
              
              <div className={styles.rightbox1}>
                <div className={styles.input3Container}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault LTV Ratio
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultLtvRatio !== undefined
                          ? `${Math.round(
                              currentVautDetails.vaultLtvRatio * 100
                            )}%`
                          : `0%`}
                      </p>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Current Collateral
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultCurrentCollateral !== undefined
                          ? `${currentVautDetails.vaultCurrentCollateral} CKBTC`
                          : 0}
                      </p>
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Vault Current Collaterisation Ratio
                    </label>
                    <div className={styles.TextRight}>
                      <p>
                        {currentVautDetails !== null &&
                        currentVautDetails.vaultLtvRatio !== undefined
                          ? `${Math.round(
                              (1 / currentVautDetails.vaultLtvRatio) * 100
                            )}%`
                          : `0%`}
                      </p>
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="ckBtc" className={styles.labelWithIcon}>
                      Health Factor
                    </label>
                    <div className={styles.TextRight}>
                      <p>0</p>
                    </div>
                  </div>
                </div>
                </div>
            </div>
            <div className="mt-6 space-y-4">
            {Allowance &&
            (Allowance.allowance < BigInt(100000000000) ||
              (Allowance.expires_at &&
                Allowance.expires_at.length > 0 &&
                Allowance.expires_at[0] / BigInt(1000000) <
                  BigInt(new Date().getTime()))) ? (
                <button
                  type="button"
                  className={styles.button4}  
                  onClick={handleApprove}
                >
                  Approve
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.button4}  
                  onClick={handleRepayDebt}
                >
                  Repay Debt
                </button>
              )}
            <button
                className={styles.button5}  
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
          ChainVault Finance - Unlock Liquidity: Borrow Against ckbtc |
          Decentralized Crypto Lending
        </title>
        <meta
          name="description"
          content="ChainVault Finance allows you to unlock liquidity by borrowing against your ckbtc holdings. Access stablecoins instantly and maximize your crypto assets. Join the future of decentralized finance today!"
        />
        <meta
          name="keywords"
          content="ChainVault Finance, ChainVault App, ChainVault, ChainVault app, ChainVault finance, ChainVault twitter, Decentralized finance platform, Crypto lending and borrowing, Collateralized loans, Synth tokens, Stablecoin minting, Instant liquidity, Yield farming, Smart contracts, Financial decentralization, Crypto-backed loans, Cryptocurrency protocol, Decentralized liquidity pool, SynthUSD stablecoin, Blockchain assets, Peer-to-peer lending, Yield optimization, DeFi ecosystem, Blockchain technology, Liquidity protocol, Asset-backed loans, Tokenized assets, Yield generation, Crypto investment, Digital currency, Yield farming strategies, DeFi governance, Crypto staking, Crypto portfolio management, Yield farming rewards, Crypto savings accounts, DeFi lending platforms, Yield farming liquidity, Crypto-backed stablecoins, Yield farming risks, Blockchain-based finance, DeFi tokenized assets, Yield farming projects, Automated finance, Crypto liquidity solutions, Liquidity mining, DeFi tokens, Tokenization of assets, Decentralized savings, Decentralized exchange, Synthetic assets, Crypto yield farming, Yield farming platforms, Crypto asset management, Crypto yield optimization, DeFi lending protocols, Crypto finance solutions, DeFi borrowing and lending, Blockchain investment strategies, Yield farming opportunities, DeFi portfolio diversification, DeFi governance tokens, Decentralized finance apps, Crypto investment vehicles, Decentralized lending platforms, Blockchain collateralization, Yield farming strategies and risks, Crypto loan collateral, DeFi liquidity providers, Crypto yield pools, Crypto trading and investment, Decentralized asset management, Cryptocurrency yield farming, Blockchain lending platforms, Crypto yield generation, Crypto portfolio optimization, DeFi asset-backed loans, Decentralized lending and borrowing, Stablecoin creation, Crypto asset diversification, Yield farming security, Blockchain-based savings, Crypto-backed loan collateral, Yield farming projects and rewards, ChainVault Finance updates"
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icons/tabicon.jpg" />{" "}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="ChainVault Finance - Unlock Liquidity with ckbtc Holdings"
        />
        <meta
          name="twitter:description"
          content="Unlock liquidity with ChainVault Finance and maximize your crypto assets. Join the future of decentralized finance!"
        />
        <meta
          name="twitter:image"
          content="https://pbs.twimg.com/profile_images/1714692668796923904/n9qKs6od_400x400.jpg"
        />
        <meta name="twitter:site" content="@ChainVaultFinance" />
        <meta name="twitter:creator" content="@ChainVaultFinance" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="ChainVault Finance - Unlock Liquidity with ckbtc Holdings"
        />
        <meta
          property="og:description"
          content="Unlock liquidity with ChainVault Finance and maximize your crypto assets. Join the future of decentralized finance!"
        />
        <meta
          property="og:image"
          content="https://pbs.twimg.com/profile_images/1714692668796923904/n9qKs6od_400x400.jpg"
        />
        <meta property="og:url" content="https://ChainVaultapp.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="ChainVault Finance - Unlock Liquidity with ckbtc Holdings"
        />
        <meta
          property="og:description"
          content="Unlock liquidity with ChainVault Finance and maximize your crypto assets. Join the future of decentralized finance!"
        />
        <meta
          property="og:image"
          content="https://pbs.twimg.com/profile_images/1714692668796923904/n9qKs6od_400x400.jpg"
        />
        <meta property="og:url" content="https://ChainVaultapp.com/" />
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
    <tr>
      <td>ETH</td>
      <td>synETH</td>
      <td>2.0%</td>
      <td>0.7%</td>
      <td>75%</td>
      <td>
        <button
          className="bg-green-300 text-black px-4 py-2 rounded-md focus:outline-none"
          onClick={toggleModal}
        >
          Manage Vault
        </button>
      </td>
    </tr>
    <tr>
      <td>BTC</td>
      <td>synBTC</td>
      <td>1.2%</td>
      <td>0.4%</td>
      <td>85%</td>
      <td>
        <button
          className="bg-green-300 text-black px-4 py-2 rounded-md focus:outline-none"
          onClick={toggleModal}
        >
          Manage Vault
        </button>
      </td>
    </tr>
    <tr>
      <td>ADA</td>
      <td>synADA</td>
      <td>1.8%</td>
      <td>0.6%</td>
      <td>70%</td>
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
          <div className={`text-xs ${styles.mintGreen}`} style={{ color: '#acf1ac' }}>
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
              <div className={styles.container2}>
                <div className={styles.modalNavbar}>
                <div className={styles.closeIconContainer}>
                    <i
                      className={`fa fa-times-circle ${styles.closeIcon}`}
                      onClick={toggleModal}
                    ></i>
                  </div>
                  <div className={styles.dropdownContainer2}>
                    <select
                      value={selectedOption}
                      onChange={handleOptionChange}
                      className={styles.dropdown2}
                    >
                      <option className={styles.options}>Borrow</option>
                      <option className={styles.options}>Add Collateral</option>
                      <option className={styles.options}>Create Vault</option>
                      <option className={styles.options}>Repay Debt</option>
                    </select>
                  </div>
                
                </div>
                <div className={styles.modalContainer}>{getForm()}</div>
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
