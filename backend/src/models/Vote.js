import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  voteHash: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  batchId: String,
});

export default mongoose.model("Vote", voteSchema);
