import React from "react";
import axios from "axios";
import { generateVoteHash } from "../utils/hash.js";
import { submitVote } from "../services/voteService.js";

const VotePage = () => {
  const handleVote = async (candidate) => {
    try {
      const walletAddress = "demo-wallet"; // temporary

      const { hash } = generateVoteHash(candidate, walletAddress);

      console.log("Generated Hash:", hash);

      const response = await submitVote(hash);

      console.log("Backend Response:", response);

      alert("Vote submitted!"); // to be replaced with react-toast
    } catch (error) {
      console.error(error);
      alert("Error submitting vote"); // to be replaced with react-toast
    }
  };
  
  return (
    <div>
      Vote Page
      <button onClick={handleVote}>Click Me!</button>
    </div>
  );
};

export default VotePage;
