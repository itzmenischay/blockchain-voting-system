import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// route imports
import voteRoutes from "./routes/voteRoutes.js";
import verifyRoutes from './routes/verifyRoutes.js'
import batchRoutes from './routes/batchRoutes.js'
import authRoutes from './routes/authRoutes.js'

// services imports
import { processBatch } from "./services/batchService.js";

dotenv.config();

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Vote routes
app.use("/api/v1/votes", voteRoutes);
app.use("/api/v1/verify", verifyRoutes);
app.use("/api/v1/batches", batchRoutes);

// auth routes
app.use("/api/auth", authRoutes)

// temporary - runs processBatch() every 30 seconds
setInterval(() => {
  processBatch();
}, 10000)

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Blockchain Voting API is running...");
});

app.listen(PORT, () => {
  console.log(`Blockchain Voting System listening at port: ${PORT}`);
});
