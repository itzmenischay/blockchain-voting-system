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
      <div>
        <h2>Vote Page</h2>
        {candidates.map((candidate) => (
          <div key={candidate} style={{ marginBottom: "10px" }}>
            <span>{candidate}</span>
            <button
              onClick={() => handleVote(candidate)}
              style={{ marginLeft: "10px" }}
            >
              Vote
            </button>
          </div>
        ))}

        {/* status */}
        <p style={{ marginTop: "20px" }}>{status}</p>
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      </div>
    </>
  );
};

export default VotePage;
