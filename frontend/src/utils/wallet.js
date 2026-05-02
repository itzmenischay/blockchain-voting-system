import { ethers } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Metamask not installed!");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return address;
};

export const signMessage = async (message) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const signature = await signer.signMessage(message);

  return signature;
};
