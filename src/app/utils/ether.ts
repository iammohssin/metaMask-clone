import { ethers } from "ethers";

export const getEthereumProvider = () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    return new ethers.BrowserProvider(window.ethereum as unknown as ethers.Eip1193Provider);
  } else {
    console.error("MetaMask not found. Please install MetaMask.");
    return null;
  }
};

export const requestAccountAccess = async () => {
  const provider = getEthereumProvider();

  if (provider) {
    if (window.ethereum && typeof window.ethereum.request === "function") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        return provider;
      } catch (error) {
        console.error("Failed to request account access:", error);
        throw new Error("Failed to request account access");
      }
    } else {
      throw new Error("Ethereum provider request method not available");
    }
  } else {
    throw new Error("Ethereum provider not found");
  }
};
