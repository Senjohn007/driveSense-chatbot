// server/index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { openai } from "./config/openai.js"; // just import, do NOT redeclare

// Import Routes
import vehicleRoutes from "./routes/vehicleRoutes.js";
import chatRouter from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("API is running");
});

// Use Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/chat", chatRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
