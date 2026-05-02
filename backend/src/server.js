import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from './lib/db.js'

dotenv.config();
connectDB()

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
