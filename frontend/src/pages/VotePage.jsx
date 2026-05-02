import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { generateVoteHash } from "../utils/hash.js";
import { submitVote } from "../services/voteService.js";
import { connectWallet } from "../utils/wallet.js";

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

      setStatus("Submitting vote...");

      const { hash } = generateVoteHash(candidate, wallet);

      const res = await submitVote(hash);
      console.log(res);
      setStatus("Vote submitted successfully!");
    } catch (error) {
      setStatus("Error submitting vote!");
    }
  };

  useEffect(() => {
    console.log("Ethereum object: ", window.ethereum);
  }, []);

  const testWallet = async () => {
    const address = await connectWallet();
    console.log("Connected wallet: ", address);
  };

  return (
    <>
      <div>
        <h2>Vote Page</h2>
        {candidates.map((candidte) => {
          <div key={candidte} style={{ marginBottom: "10px" }}>
            <span>{candidte}</span>
            <button
              onClick={() => handleVote(candidte)}
              style={{ marginLeft: "10px", font: "black"}}
            >
              Vote
            </button>
          </div>;
        })}

        {/* status */}
        <p style={{ marginTop: "20px" }}>{status}</p>
        <button onClick={testWallet}>Connect Wallet</button>
      </div>
    </>
  );
};

export default VotePage;
