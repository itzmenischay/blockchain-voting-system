import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  voteHash: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  walletAddress: { type: String, required: true },
  nullifier: { type: String, required: true, unique: true },
  batchId: String,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "batched"], default: "pending" },
});

export default mongoose.model("Vote", voteSchema);
