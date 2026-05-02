import React from "react";
import crypto from "crypto-js";

const handleVote = async (candidate) => {
  const hash = crypto.SHA256(candidate + Date.now()).toString();

  await axios.post("http://localhost:3000/api/vote", {
    voteHash: hash,
  });
};
const VotePage = () => {
  return <div>Vote Page</div>;
};

export default VotePage;
