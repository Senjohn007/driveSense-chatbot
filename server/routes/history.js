import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const messages = await Message.find({ sessionId }).sort("createdAt");
  res.json(messages);
});

router.delete("/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  await Message.deleteMany({ sessionId });
  res.json({ ok: true });
});

export default router;
