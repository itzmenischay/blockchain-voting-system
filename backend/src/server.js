import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// route imports
import voteRoutes from "./routes/voteRoutes.js";
import verifyRoutes from './routes/verifyRoutes.js'

// services imports
import { processBatch } from "./services/batchService.js";

dotenv.config();

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// App routes
app.use("/api/v1/votes", voteRoutes);
app.use("/api/v1/verify", verifyRoutes);

// temporary - runs processBatch() every 30 seconds
setInterval(() => {
  processBatch();
}, 60000)

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Blockchain Voting API is running...");
});

app.listen(PORT, () => {
  console.log(`Blockchain Voting System listening at port: ${PORT}`);
});
