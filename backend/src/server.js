import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// route imports
import voteRoutes from "./routes/voteRoutes.js";

dotenv.config();

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/votes", voteRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Blockchain Voting API is running...");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
