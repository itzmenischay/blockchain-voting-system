import { create } from "zustand";

export const useVoteStore = create((set) => ({
  wallet: null,
  voteHash: "",
  voteState: "idle",
  polling: false,

  setWallet: (wallet) => {
    localStorage.setItem("wallet", wallet);
    set({ wallet });
  },

  setVote: (hash) => {
    localStorage.setItem("voteHash", hash);
    localStorage.setItem("voteState", "pending");

    set({
      voteHash: hash,
      voteState: "pending",
      polling: true,
    });
  },

  setVoteHashOnly: (hash) => set({ voteHash: hash }),

  setVerified: () => {
    localStorage.setItem("voteState", "verified");

    set({
      voteState: "verified",
      polling: false,
    });
  },

  setVoteState: (state) => set({ voteState: state }),

  hydrate: () => {
    const wallet = localStorage.getItem("wallet");
    const voteHash = localStorage.getItem("voteHash");
    const voteState = localStorage.getItem("voteState");

    set({
      wallet: wallet || null,
      voteHash: voteHash || "",
      voteState: voteState || "idle",
      polling: voteState === "pending",
    });
  },
}));
