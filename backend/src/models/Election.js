import mongoose from "mongoose";

const electionSchema = new mongoose.Schema({
  title: String,
  candidates: [String],
  startTime: Date,
  endTime: Date,
  status: {
    type: String,
    enum: ["upcoming", "active", "ended"],
    default: "upcoming",
  },
});

export default mongoose.model("Election", electionSchema);