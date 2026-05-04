import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;

const abi = [
  "function storeBatch(string memory _batchId, bytes32 _root) public",
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

export const storeOnChain = async (batchId, root) => {
  try {
    console.log("Sending to blockchain...");
    const tx = await contract.storeBatch(batchId, "0x" + root);
    console.log("Transaction sent: ", tx.hash);

    await tx.wait();

    console.log("Stored on blockchain: ", batchId, root);
  } catch (error) {
    console.error("Blockchain error: ", error.message);
    console.error("Blockchain FULL ERROR:");
    console.error(error);
  }
};
