import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batchId: String,
  merkleRoot: String,
  transactionHash: String,
  status: String,
});

export default mongoose.model("Batch", batchSchema);