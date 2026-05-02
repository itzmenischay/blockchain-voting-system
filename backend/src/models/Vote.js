import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  voteHash: String,
  timeStamp: { type: Date, default: Date.now },
  batchId: String,
});

export default mongoose.model("Vote", voteSchema);