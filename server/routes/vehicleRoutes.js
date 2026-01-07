import express from "express";
import Vehicle from "../models/Vehicle.js";

const router = express.Router();

// GET all vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().lean();
    res.json(vehicles);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET vehicles by name or tag (optional handy filter)
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const vehicles = await Vehicle.find({
      $or: [
        { name: new RegExp(q, "i") },
        { tags: { $in: [new RegExp(q, "i")] } },
      ],
    }).lean();
    res.json(vehicles);
  } catch (err) {
    console.error("Error searching vehicles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
