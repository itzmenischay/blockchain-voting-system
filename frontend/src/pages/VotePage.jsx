import React, { useState, useEffect } from "react";
import { generateVoteHash } from "../utils/hash.js";
import { submitVote } from "../services/voteService.js";
import { connectWallet, signMessage } from "../utils/wallet.js";
import { generateNullifier } from "../utils/nullifier.js";

const VotePage = () => {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState("");

  const candidates = ["Candidate A", "Candidate B"];
  const electionId = "election-1"; // temporary

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setWallet(address);
      setStatus("Wallet Connected!");
    }
  };

  const handleVote = async (candidate) => {
    try {
      if (!wallet) {
        setStatus("Please connect wallet first");
        return;
      }

      setStatus("Signing vote...");

      // 1. generate vote hash
      const { hash } = generateVoteHash(candidate, wallet);

      // 2. generate nullifier
      const nullifer = generateNullifier(wallet, electionId);

      // 3. sign message
      const message = `Vote:${hash}`;
      const signature = await signMessage(message);

      console.log("Signature: ", signature);
      console.log("Nullifier: ", nullifer);
      console.log("Signature: ", signature);

      setStatus("Submitting vote...");

      // 4. send everything
      await submitVote(hash, wallet, signature, nullifer);

      setStatus("Vote submitted successfully!");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error;
      if (msg === "User already voted") {
        setStatus("You have already voted!");
      } else if (msg === "Invalid signature") {
        setStatus("Signature verification failed!");
      } else {
        setStatus("Something went wrong.");
      }
    }
  };

  useEffect(() => {
    console.log("Ethereum object: ", window.ethereum);
  }, []);

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold m-10">Vote Page</h2>
        <div className="flex justify-between p-10">
          {candidates.map((candidate) => (
            <div key={candidate} style={{ marginBottom: "10px" }} className="flex flex-col justify-center items-center p-10 border">
              <span>{candidate}</span>
              <button
                onClick={() => handleVote(candidate)}
                style={{ marginLeft: "10px" }}
                className="border rounded-xl p-4 bg-slate-400 text-white font-bold cursor-pointer"
              >
                Vote
              </button>
            </div>
          ))}
        </div>

        {/* status */}
        <p style={{ marginTop: "20px" }}>{status}</p>
        <button className="border rounded-xl p-4 bg-slate-400 text-white font-bold cursor-pointer" onClick={handleConnectWallet}>Connect Wallet</button>
      </div>
    </>
  );
};

export default VotePage;
