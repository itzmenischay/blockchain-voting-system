import React from "react";
import { useState, useEffect } from "react";
import { generateVoteHash } from "../utils/hash.js";
import { submitVote } from "../services/voteService.js";
import { connectWallet, signMessage } from "../utils/wallet.js";

const VotePage = () => {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState("");

  const candidates = ["Candidate A", "Candidate B"];

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

      const { hash } = generateVoteHash(candidate, wallet);

      // Message to sign
      const message = `Vote:${hash}`;

      const signature = await signMessage(message);
      console.log("Signature: ", signature);

      setStatus("Submitting vote...");

      await submitVote(hash, wallet, signature);

      setStatus("Vote submitted successfully!");
    } catch (error) {
      console.error(error);
      setStatus("Error submitting vote!");
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
