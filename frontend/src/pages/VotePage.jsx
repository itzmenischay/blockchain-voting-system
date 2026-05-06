import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// services
import { submitVote } from "../services/voteService";
import { verifyVote } from "../services/verifyService";

// utils
import { generateVoteHash } from "../utils/hash";
import { connectWallet, signMessage } from "../utils/wallet";
import { generateNullifier } from "../utils/nullifier";

// components
import GlassCard from "../components/GlassCard";
import SectionWrapper from "../components/SectionWrapper";
import Toast from "../components/Toast";

// icons
import {
  Wallet,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  User,
  Loader2,
  Fingerprint,
} from "lucide-react";
import { useVoteStore } from "../store/useVoteStore";

const VotePage = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toastConfig, setToastConfig] = useState(null);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const {
    wallet,
    voteHash,
    voteState,
    polling,
    setWallet,
    setVote,
    setVoteHashOnly,
    setVerified,
    setVoteState,
  } = useVoteStore();

  const candidates = [
    { id: "1", name: "Alice Johnson", role: "Protocol Delegate" },
    { id: "2", name: "Bob Smith", role: "Network Validator" },
  ];

  const electionId = "election-1";

  const showToast = (message, type = "info") => {
    setToastConfig({ message, type });
  };

  // Connect Wallet
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setWallet(address);
      showToast("Wallet connected!", "success");
    } catch {
      showToast("Failed to connect wallet", "error");
    } finally {
      setIsConnecting(false);
    }
  };

  // Vote
  const handleVote = async (candidateName) => {
    if (!wallet) {
      showToast("Connect wallet first", "error");
      return;
    }

    setVoteState("voting");
    setActiveCandidate(candidateName);
    setSelectedCandidate(candidateName);

    try {
      const { hash } = generateVoteHash(candidateName, wallet);
      const nullifier = generateNullifier(wallet, electionId);
      const signature = await signMessage(`Vote:${hash}`);

      await submitVote(hash, wallet, signature, nullifier);

      setVote(hash); // 👈 replaces voteHash + voteState + polling + localStorage

      setActiveCandidate(null);

      showToast("Vote submitted!", "success");
    } catch (err) {
      setVoteState("idle");
      setActiveCandidate(null);

      const msg = err.response?.data?.error;

      if (msg === "User already voted") {
        showToast("You already voted!", "error");
      } else {
        showToast("Vote failed", "error");
      }
    }
  };

  // verify vote
  const handleVerify = async () => {
    if (!voteHash) return;

    setVoteState("verifying");

    try {
      const res = await verifyVote(voteHash);

      if (res.pending) {
        showToast("Waiting for batch...", "info");
        setVoteState("pending");
      } else {
        setVerifyResult(res);
        setVerified(); // 👈 replaces voteState + localStorage
        showToast("Vote verified!", "success");
      }
    } catch {
      setVoteState("pending");
      showToast("Verification failed", "error");
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(voteHash);
    setCopied(true);

    showToast("Copied to clipboard", "success");

    setTimeout(() => setCopied(false), 1500);
  };

  useEffect(() => {
    if (!polling || !voteHash) return;

    const interval = setInterval(async () => {
      try {
        const res = await verifyVote(voteHash);

        if (!res.pending) {
          setVerifyResult(res);
          setVerified();
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Polling error: ", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [polling, voteHash]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Toast */}
      <AnimatePresence>
        {toastConfig && (
          <Toast
            message={toastConfig.message}
            type={toastConfig.type}
            onClose={() => setToastConfig(null)}
          />
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* HEADER */}
        <SectionWrapper className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 tracking-tight">
            Active Election
          </h2>
          <p className="text-slate-400 max-w-xl mb-10">
            Select a candidate below. Your vote will be cryptographically
            signed, anonymized via nullifiers, and submitted to the
            decentralized network.
          </p>

          {wallet ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 px-5 py-2.5 bg-green-500/10 border border-green-500/20 rounded-full"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400 font-medium tracking-wide">
                {wallet.slice(0, 6)}...{wallet.slice(-4)}
              </span>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="px-8 py-3.5 bg-white text-slate-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-70"
            >
              {isConnecting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Wallet className="w-5 h-5" />
              )}
              {isConnecting ? "Connecting..." : "Connect Web3 Wallet"}
            </motion.button>
          )}
        </SectionWrapper>

        {/* STATUS */}
        <div className="flex justify-center min-h-[20px] items-center">
          <AnimatePresence mode="wait">
            {voteState === "pending" && (
              <motion.div
                key="pending"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-yellow-400"
              >
                <Clock className="animate-pulse w-4 h-4" />
                Syncing with blockchain...
              </motion.div>
            )}

            {voteState === "verified" && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-green-400"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verified on blockchain
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CANDIDATES */}
        <SectionWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 w-full max-w-3xl mx-auto">
            {candidates.map((c) => (
              <GlassCard
                key={c.id}
                className={`p-8 flex flex-col items-center group transition-all duration-300 ${
                  selectedCandidate === c.name
                    ? "border-blue-500 bg-blue-500/10"
                    : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center mb-6 shadow-inner relative z-10">
                  <User className="w-10 h-10 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-1 relative z-10">
                  {c.name}
                </h3>
                <p className="text-sm text-slate-500 mb-8 relative z-10">
                  {c.role}
                </p>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote(c.name)}
                  disabled={
                    voteState === "pending" ||
                    voteState === "verified" ||
                    (voteState === "voting" && activeCandidate === c.name)
                  }
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative z-10 flex justify-center items-center gap-2"
                >
                  {voteState === "verified" ? (
                    "Vote Locked"
                  ) : voteState === "voting" && activeCandidate === c.name ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Cast Vote"
                  )}
                </motion.button>
              </GlassCard>
            ))}
          </div>
        </SectionWrapper>

        {/* VERIFY */}
        <SectionWrapper>
          <div className="max-w-2xl mx-auto w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Fingerprint className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-slate-100">
                Verify Your Vote
              </h3>
            </div>

            <p className="text-slate-400 text-sm mb-6 relative z-10">
              Enter your transaction hash to verify cryptographically that your
              vote was included.
            </p>

            <div className="relative z-10 space-y-4">
              <input
                type="text"
                placeholder="0x..."
                value={voteHash}
                onChange={(e) => setVoteHashOnly(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/40 border border-white/10 text-slate-200"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVerify}
                  disabled={!voteHash || voteState === "verifying"}
                  className="flex-1 py-3.5 bg-white/10 rounded-xl flex items-center justify-center gap-2"
                >
                  {voteState === "verifying" ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Verify"
                  )}
                </motion.button>

                <button
                  onClick={copyHash}
                  disabled={!voteHash}
                  className="px-6 py-3.5 bg-black/40 rounded-xl flex items-center gap-2"
                >
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {verifyResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-green-400 text-sm break-all"
                >
                  {verifyResult.root}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default VotePage;
