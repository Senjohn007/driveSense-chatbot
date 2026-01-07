// server/index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

// Import Routes
import vehicleRoutes from "./routes/vehicleRoutes.js";
import chatRouter from "./routes/chat.js";
import historyRouter from "./routes/history.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB().catch(err => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.send("API is running");
});

// Use Routes - make sure these are correctly defined
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/history", historyRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});