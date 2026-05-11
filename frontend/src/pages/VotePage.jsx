import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router";

// services
import { submitVote } from "../services/voteService";
import { verifyVote } from "../services/verifyService";
import { getElectionById } from "../services/electionService";

// store
import { useAuthStore } from "../store/useAuthStore";
import { useVoteStore } from "../store/useVoteStore";

// utils
import { generateVoteHash } from "../utils/hash";
import { connectWallet, signMessage } from "../utils/wallet";
import { generateNullifier } from "../utils/nullifier";

// components
import GlassCard from "../components/GlassCard";
import SectionWrapper from "../components/SectionWrapper";
import Toast from "../components/Toast";

// services
import { validateWallet } from "../services/authService";

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
  ArrowLeft,
} from "lucide-react";

const VotePage = () => {
  const navigate = useNavigate();
  const { electionId } = useParams();

  const [isConnecting, setIsConnecting] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toastConfig, setToastConfig] = useState(null);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);

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

  const { updateUser } = useAuthStore();

  const showToast = (message, type = "info") => {
    setToastConfig({
      message,
      type,
    });
  };

  // Fetch election dynamically
  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await getElectionById(electionId);

        const electionData = res.data;

        setElection(electionData);

        setCandidates(
          electionData.candidates.map((candidate, index) => ({
            id: index + 1,
            name: candidate,
            role: "Election Candidate",
          })),
        );
      } catch (err) {
        console.error(err);

        showToast(
          err.response?.data?.message || "Failed to load election",
          "error",
        );

        navigate("/elections");
      }
    };

    fetchElection();
  }, [electionId, navigate]);

  // Connect wallet
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);

      const address = await connectWallet();

      if (!address) {
        showToast("Wallet connection failed", "error");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));

      const message = `Link wallet to voting account: ${user.id}`;

      const signature = await signMessage(message);

      await validateWallet(address, signature);

      setWallet(address);

      const existingUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...existingUser,
        walletAddress: address.toLowerCase(),
      };

      updateUser(updatedUser);

      showToast("Wallet connected!", "success");
    } catch (error) {
      console.error(error);

      const msg = error?.response?.data?.message;

      showToast(msg || "Failed to connect wallet", "error");
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
      const { hash } = generateVoteHash(election?._id, candidateName, wallet);

      const nullifier = generateNullifier(wallet, election?._id);

      const timestamp = Date.now();

      const message = `
Blockchain Voting System

Election: ${election?._id}
Candidate: ${candidateName}

Vote Hash: ${hash}

Wallet: ${wallet.toLowerCase()}

Timestamp: ${timestamp}
`;

      const signature = await signMessage(message);

      await submitVote({
        electionId: election?._id,
        candidate: candidateName,
        voteHash: hash,
        walletAddress: wallet,
        signature,
        nullifier,
        timestamp,
      });

      setVote(hash);

      setActiveCandidate(null);

      showToast("Vote submitted!", "success");
    } catch (err) {
      setVoteState("idle");

      setActiveCandidate(null);

      const msg = err.response?.data?.message;

      showToast(msg || "Vote failed", "error");
    }
  };

  // Verify
  const handleVerify = async () => {
    if (!voteHash) return;

    setVoteState("verifying");

    try {
      const res = await verifyVote(voteHash);

      if (res.status === "pending" || res.status === "processing") {
        showToast("Waiting for batch...", "info");

        setVoteState("pending");
      } else {
        setVerifyResult(res);

        setVerified();

        showToast("Vote verified!", "success");
      }
    } catch {
      setVoteState("pending");

      showToast("Verification failed", "error");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <AnimatePresence>
        {toastConfig && (
          <Toast
            message={toastConfig.message}
            type={toastConfig.type}
            onClose={() => setToastConfig(null)}
          />
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        <button
          onClick={() => navigate("/elections")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Elections
        </button>

        {/* rest of UI stays same */}
      </div>
    </div>
  );
};

export default VotePage;
