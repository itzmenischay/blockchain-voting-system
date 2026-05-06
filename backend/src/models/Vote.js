import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  voteHash: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  batchId: String,
  nullifier: { type: String, required: true, unique: true },
  status: { type: String, enum: ["pending", "batched"], default: "pending" },
});

export default mongoose.model("Vote", voteSchema);
