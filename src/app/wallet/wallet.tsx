"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { ethers, formatEther, parseEther } from "ethers";
import { getEthereumProvider, requestAccountAccess } from "../utils/ether";
import { FaEthereum, FaWallet, FaSignOutAlt, FaSpinner, FaInfoCircle, FaUserCircle, FaGlobe } from "react-icons/fa";

const Wallet = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [network, setNetwork] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [showSendForm, setShowSendForm] = useState<boolean>(false); // New state for form visibility

    useEffect(() => {
        const provider = getEthereumProvider();
        const userDisconnected = localStorage.getItem("userDisconnected") === "true";
        const cachedAccount = localStorage.getItem("connectedAccount");

        if (provider && cachedAccount && !userDisconnected) {
            fetchWalletData(); // Auto-connect if user hasn't manually disconnected
        }
    }, []);

    const fetchWalletData = async () => {
        setLoading(true);
        const provider = getEthereumProvider();
        if (provider) {
            const signer = await provider.getSigner();
            try {
                const userAddress = await signer.getAddress();
                setAccount(userAddress);
                localStorage.setItem("connectedAccount", userAddress); // Store account address in localStorage

                const userBalance = await provider.getBalance(userAddress);
                setBalance(formatEther(userBalance));

                const network = await provider.getNetwork();
                setNetwork(network.name);

                localStorage.setItem("userDisconnected", "false"); // Reset userDisconnected flag
            } catch (err) {
                console.error("Failed to fetch account:", err);
                setError("Failed to fetch account.");
            }
        }
        setLoading(false);
    };

    const connectWallet = async () => {
        setLoading(true);
        try {
            const provider = await requestAccountAccess();
            if (provider) {
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                setAccount(userAddress);

                const userBalance = await provider.getBalance(userAddress);
                setBalance(formatEther(userBalance));

                const network = await provider.getNetwork();
                setNetwork(network.name);

                localStorage.setItem("connectedAccount", userAddress); // Store connected account in localStorage
                localStorage.setItem("userDisconnected", "false"); // Reset userDisconnected flag
            }
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            setError("Failed to connect wallet.");
        }
        setLoading(false);
    };

    const disconnectWallet = () => {
        setAccount(null);
        setBalance(null);
        setNetwork(null);
        setError(null);
        setShowSendForm(false); // Reset form visibility on disconnect

        localStorage.removeItem("connectedAccount"); // Clear cached account from localStorage
        localStorage.setItem("userDisconnected", "true"); // Set userDisconnected flag to true
    };

    const sendTransaction = async () => {
        if (!recipient || !amount) {
            setError("Please enter a valid recipient address and amount.");
            return;
        }

        try {
            setLoading(true);
            setTransactionStatus(null);
            const provider = getEthereumProvider();
            const signer = await provider.getSigner();

            const tx = await signer.sendTransaction({
                to: recipient,
                value: parseEther(amount),
            });

            await tx.wait(); // Wait for the transaction to be mined
            setTransactionStatus(`Transaction successful with hash: ${tx.hash}`);
            setAmount("");
            setRecipient("");
            setShowSendForm(false); // Hide form after successful transaction
        } catch (err) {
            console.error("Transaction failed:", err);
            setError("Transaction failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>My MetaMask Wallet</title>
            </Head>
            <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-purple-500 to-blue-600 text-black'} flex flex-col items-center justify-center min-h-screen p-6 md:p-10`}>
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl shadow-2xl p-10 w-full max-w-4xl transition-transform transform hover:scale-105 border border-gray-300 relative`}>
                    <h1 className="text-4xl font-bold mb-6 flex items-center">
                        <FaWallet className="mr-3 text-purple-500" /> MetaMask Wallet
                    </h1>
                    {loading && (
                        <div className="flex items-center justify-center my-4">
                            <FaSpinner className="animate-spin text-purple-500" size={24} />
                            <span className="ml-2">Loading...</span>
                        </div>
                    )}
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    {transactionStatus && <p className="text-green-500 mb-4 text-center">{transactionStatus}</p>}
                    {account ? (
                        <div className="text-left mt-4">
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-purple-200 to-purple-400'} rounded-lg p-4 mb-4 shadow-lg transition-transform transform hover:scale-105 border border-purple-300 relative`}>
                                <p className="font-semibold flex items-center">
                                    <FaUserCircle className="mr-2 text-2xl text-purple-600" />
                                    Connected Account:
                                </p>
                                <p className="break-all">{account}</p>
                            </div>
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-purple-200 to-purple-400'} rounded-lg p-4 mb-4 shadow-lg transition-transform transform hover:scale-105 border border-purple-300 relative`}>
                                <p className="text-lg flex items-center">
                                    <FaEthereum className="mr-2 text-3xl text-purple-600" />
                                    <span className="font-semibold">Balance: {balance} ETH</span>
                                </p>
                                <p className="text-lg flex items-center mt-2">
                                    <FaGlobe className="mr-2 text-2xl text-purple-600" />
                                    <span className="font-bold">Network:</span> {network}
                                    <span className="flex items-center ml-2">
                                        <FaInfoCircle className="text-gray-500" />
                                    </span>
                                </p>
                            </div>

                            {/* Send ETH Button */}
                            <button
                                className="mt-4 bg-purple-600 text-white rounded-lg px-4 py-2 text-lg transition duration-300 hover:bg-purple-500 flex items-center justify-center"
                                onClick={() => setShowSendForm(true)} // Show the form on button click
                                disabled={loading}
                            >
                                Send ETH
                            </button>

                            {/* Transaction Form */}
                            {showSendForm && (
                                <div className="mt-4">
                                    <h2 className="text-2xl font-semibold mb-2">Send ETH</h2>
                                    <input
                                        type="text"
                                        className="w-full p-2 mb-4 border border-gray-400 rounded-lg"
                                        placeholder="Recipient Address"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="w-full p-2 mb-4 border border-gray-400 rounded-lg"
                                        placeholder="Amount (ETH)"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                    <button
                                        className="bg-purple-600 text-white rounded-lg px-4 py-2 text-lg transition duration-300 hover:bg-purple-500 flex items-center justify-center"
                                        onClick={sendTransaction}
                                        disabled={loading}
                                    >
                                        Send Now
                                    </button>
                                </div>
                            )}

                            <button
                                className="mt-4 bg-red-600 text-white rounded-lg px-4 py-2 text-lg transition duration-300 hover:bg-red-500 flex items-center justify-center"
                                onClick={disconnectWallet}
                            >
                                <FaSignOutAlt className="mr-2" /> Disconnect Wallet
                            </button>
                        </div>
                    ) : (
                        <button
                            className="bg-purple-600 text-white rounded-lg px-4 py-2 text-lg transition duration-300 hover:bg-purple-500 flex items-center justify-center"
                            onClick={connectWallet}
                            disabled={loading}
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Wallet;
