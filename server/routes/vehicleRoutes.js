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

// GET vehicles by name or tag
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

// DEBUG route - must come before the /:id route
router.get("/debug", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().lean();
    res.json({
      count: vehicles.length,
      vehicles: vehicles.map(v => ({
        name: v.name,
        brand: v.brand,
        type: v.type,
        tags: v.tags
      }))
    });
  } catch (err) {
    console.error("Error debugging vehicles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// SEED route - must come before the /:id route
router.post("/seed", async (req, res) => {
  try {
    // Clear existing vehicles
    await Vehicle.deleteMany({});
    
    // Seed data
    const vehicles = [
      {
        name: "Toyota Corolla",
        type: "Car",
        brand: "Toyota",
        engine: "1.8L 4-cylinder",
        mileage: "31 MPG city / 40 MPG highway",
        price: "$20,025",
        maintenance: "Low maintenance costs, reliable",
        tags: ["sedan", "fuel-efficient", "reliable"]
      },
      {
        name: "Honda Civic",
        type: "Car",
        brand: "Honda",
        engine: "2.0L 4-cylinder",
        mileage: "32 MPG city / 42 MPG highway",
        price: "$21,700",
        maintenance: "Affordable maintenance, good resale value",
        tags: ["sedan", "fuel-efficient", "reliable"]
      },
      {
        name: "Tesla Model 3",
        type: "EV",
        brand: "Tesla",
        engine: "Electric motor",
        mileage: "132 MPGe (combined)",
        price: "$39,990",
        maintenance: "Minimal maintenance, battery warranty",
        tags: ["electric", "sedan", "high-tech", "efficiency"]
      },
      {
        name: "Ford F-150",
        type: "Truck",
        brand: "Ford",
        engine: "3.3L V6",
        mileage: "20 MPG city / 24 MPG highway",
        price: "$30,070",
        maintenance: "Moderate maintenance costs, durable",
        tags: ["truck", "utility", "powerful"]
      },
      {
        name: "BMW 3 Series",
        type: "Car",
        brand: "BMW",
        engine: "2.0L Turbo 4-cylinder",
        mileage: "26 MPG city / 36 MPG highway",
        price: "$41,250",
        maintenance: "Higher maintenance costs, premium performance",
        tags: ["sedan", "luxury", "performance"]
      },
      {
        name: "Honda CR-V",
        type: "SUV",
        brand: "Honda",
        engine: "1.5L Turbo 4-cylinder",
        mileage: "28 MPG city / 34 MPG highway",
        price: "$26,400",
        maintenance: "Low maintenance costs, reliable",
        tags: ["suv", "family", "versatile"]
      },
      {
        name: "Toyota Prius",
        type: "Hybrid",
        brand: "Toyota",
        engine: "1.8L 4-cylinder + Electric Motor",
        mileage: "54 MPG city / 50 MPG highway",
        price: "$24,525",
        maintenance: "Low maintenance, hybrid system warranty",
        tags: ["hybrid", "fuel-efficient", "eco-friendly"]
      },
      {
        name: "Harley-Davidson Iron 883",
        type: "Bike",
        brand: "Harley-Davidson",
        engine: "883cc Evolution",
        mileage: "51 MPG (combined)",
        price: "$9,999",
        maintenance: "Regular maintenance required, classic style",
        tags: ["motorcycle", "cruiser", "classic"]
      }
    ];
    
    // Insert vehicles - removed the redundant loop
    const insertedVehicles = await Vehicle.insertMany(vehicles);
    
    res.json({ 
      message: "Vehicle data seeded successfully",
      count: insertedVehicles.length,
      vehicles: insertedVehicles.map(v => v.name)
    });
  } catch (err) {
    console.error("Error seeding vehicles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET vehicle by ID - must come after all specific routes
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).lean();
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    console.error("Error fetching vehicle:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;