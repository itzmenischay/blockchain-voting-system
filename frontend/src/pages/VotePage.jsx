import React, { useState } from "react";
import { generateVoteHash } from "../utils/hash.js";
import { submitVote } from "../services/voteService.js";
import { verifyVote } from "../services/verifyService.js";
import { connectWallet, signMessage } from "../utils/wallet.js";
import { generateNullifier } from "../utils/nullifier.js";

const VotePage = () => {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState("");
  const [voteHash, setVoteHash] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const candidates = ["Candidate A", "Candidate B"];
  const electionId = "election-1";

  // connect wallet
  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setWallet(address);
      setStatus("Wallet connected ✔");
    }
  };

  // vote
  const handleVote = async (candidate) => {
    try {
      if (!wallet) {
        setStatus("Please connect wallet first");
        return;
      }

      setStatus("Signing vote...");

      const { hash } = generateVoteHash(candidate, wallet);
      const nullifier = generateNullifier(wallet, electionId);

      const message = `Vote:${hash}`;
      const signature = await signMessage(message);

      setStatus("Submitting vote...");

      await submitVote(hash, wallet, signature, nullifier);

      setVoteHash(hash); // auto-fill for verification
      setStatus("Vote submitted successfully ✔");
    } catch (error) {
      console.error(error);

      const msg = error.response?.data?.error;

      if (msg === "User already voted") {
        setStatus("You have already voted");
      } else if (msg === "Invalid signature") {
        setStatus("Signature verification failed");
      } else {
        setStatus("Something went wrong");
      }
    }
  };

  // verify vote
  const handleVerify = async () => {
    try {
      const res = await verifyVote(voteHash);

      if (res.pending) {
        setVerifyResult(null);
        setStatus("Vote recorded, waiting for batch...");
        return;
      }

      setVerifyResult(res);
      setStatus("Vote verified!");
    } catch (error) {
      console.error(error);
      setVerifyResult(null);
      setStatus("Verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h2 className="text-3xl font-bold mb-6">Blockchain Voting System</h2>

      {/* Wallet */}
      {wallet ? (
        <p className="mb-4 text-green-600">
          Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}
        </p>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="mb-6 px-6 py-2 bg-blue-500 text-white rounded-lg"
        >
          Connect Wallet
        </button>
      )}

      {/* Candidates */}
      <div className="flex gap-6 mb-6">
        {candidates.map((candidate) => (
          <div
            key={candidate}
            className="flex flex-col items-center p-6 border rounded-lg shadow"
          >
            <span className="mb-2 font-semibold">{candidate}</span>

            <button
              onClick={() => handleVote(candidate)}
              className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800"
            >
              Vote
            </button>
          </div>
        ))}
      </div>

      {/* Status */}
      <p className="mb-6 text-sm text-gray-700">{status}</p>

      {/* Verification Section */}
      <div className="w-full max-w-md border-t pt-6">
        <h3 className="text-xl font-semibold mb-3">Verify Your Vote</h3>

        <input
          type="text"
          placeholder="Enter vote hash"
          value={voteHash}
          onChange={(e) => setVoteHash(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <button
          onClick={handleVerify}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Verify Vote
        </button>

        {/* Result */}
        {verifyResult && (
          <div className="mt-4 p-3 bg-green-50 border rounded">
            <p className="text-green-700 font-semibold">
              Vote is included in batch
            </p>

            <p className="text-sm mt-2 break-all">
              <strong>Root:</strong> {verifyResult.root}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;
