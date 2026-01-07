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
// SEED route - must come before the /:id route
router.post("/seed", async (req, res) => {
  try {
    // Clear existing vehicles
    await Vehicle.deleteMany({});
    
    // Expanded seed data
    const vehicles = [
      // Compact Cars
      {
        name: "Toyota Corolla",
        type: "Car",
        brand: "Toyota",
        engine: "1.8L 4-cylinder",
        mileage: "31 MPG city / 40 MPG highway",
        price: "$20,025",
        maintenance: "Low maintenance costs, reliable",
        tags: ["sedan", "fuel-efficient", "reliable", "compact", "budget-friendly"]
      },
      {
        name: "Honda Civic",
        type: "Car",
        brand: "Honda",
        engine: "2.0L 4-cylinder",
        mileage: "32 MPG city / 42 MPG highway",
        price: "$21,700",
        maintenance: "Affordable maintenance, good resale value",
        tags: ["sedan", "fuel-efficient", "reliable", "compact", "budget-friendly"]
      },
      {
        name: "Mazda3",
        type: "Car",
        brand: "Mazda",
        engine: "2.5L 4-cylinder",
        mileage: "28 MPG city / 36 MPG highway",
        price: "$21,500",
        maintenance: "Average maintenance costs, good reliability",
        tags: ["sedan", "stylish", "compact", "budget-friendly"]
      },
      {
        name: "Volkswagen Jetta",
        type: "Car",
        brand: "Volkswagen",
        engine: "1.5L 4-cylinder Turbo",
        mileage: "31 MPG city / 41 MPG highway",
        price: "$19,990",
        maintenance: "Moderate maintenance costs, German engineering",
        tags: ["sedan", "fuel-efficient", "compact", "budget-friendly"]
      },
      
      // Mid-size Sedans
      {
        name: "Toyota Camry",
        type: "Car",
        brand: "Toyota",
        engine: "2.5L 4-cylinder",
        mileage: "29 MPG city / 41 MPG highway",
        price: "$25,295",
        maintenance: "Low maintenance costs, reliable",
        tags: ["sedan", "fuel-efficient", "reliable", "mid-size", "family"]
      },
      {
        name: "Honda Accord",
        type: "Car",
        brand: "Honda",
        engine: "1.5L Turbo 4-cylinder",
        mileage: "30 MPG city / 38 MPG highway",
        price: "$26,120",
        maintenance: "Affordable maintenance, good resale value",
        tags: ["sedan", "fuel-efficient", "reliable", "mid-size", "family"]
      },
      {
        name: "Nissan Altima",
        type: "Car",
        brand: "Nissan",
        engine: "2.5L 4-cylinder",
        mileage: "28 MPG city / 39 MPG highway",
        price: "$24,550",
        maintenance: "Average maintenance costs, comfortable",
        tags: ["sedan", "fuel-efficient", "mid-size", "family", "comfortable"]
      },
      {
        name: "Hyundai Sonata",
        type: "Car",
        brand: "Hyundai",
        engine: "2.5L 4-cylinder",
        mileage: "28 MPG city / 38 MPG highway",
        price: "$24,500",
        maintenance: "Low maintenance costs, great warranty",
        tags: ["sedan", "fuel-efficient", "mid-size", "family", "warranty"]
      },
      
      // Electric Vehicles
      {
        name: "Tesla Model 3",
        type: "EV",
        brand: "Tesla",
        engine: "Electric motor",
        mileage: "132 MPGe (combined)",
        price: "$39,990",
        maintenance: "Minimal maintenance, battery warranty",
        tags: ["electric", "sedan", "high-tech", "efficiency", "premium"]
      },
      {
        name: "Tesla Model Y",
        type: "EV",
        brand: "Tesla",
        engine: "Dual Electric Motors",
        mileage: "127 MPGe (combined)",
        price: "$52,990",
        maintenance: "Minimal maintenance, battery warranty",
        tags: ["electric", "suv", "high-tech", "efficiency", "premium", "family"]
      },
      {
        name: "Nissan Leaf",
        type: "EV",
        brand: "Nissan",
        engine: "Electric motor",
        mileage: "111 MPGe (combined)",
        price: "$27,400",
        maintenance: "Minimal maintenance, affordable EV",
        tags: ["electric", "hatchback", "efficiency", "budget-friendly", "eco-friendly"]
      },
      {
        name: "Chevrolet Bolt EV",
        type: "EV",
        brand: "Chevrolet",
        engine: "Electric motor",
        mileage: "120 MPGe (combined)",
        price: "$26,500",
        maintenance: "Minimal maintenance, good range",
        tags: ["electric", "hatchback", "efficiency", "budget-friendly", "eco-friendly"]
      },
      {
        name: "Ford Mustang Mach-E",
        type: "EV",
        brand: "Ford",
        engine: "Electric motor",
        mileage: "101 MPGe (combined)",
        price: "$43,895",
        maintenance: "Minimal maintenance, performance EV",
        tags: ["electric", "suv", "performance", "premium", "eco-friendly"]
      },
      
      // Hybrid Vehicles
      {
        name: "Toyota Prius",
        type: "Hybrid",
        brand: "Toyota",
        engine: "1.8L 4-cylinder + Electric Motor",
        mileage: "54 MPG city / 50 MPG highway",
        price: "$24,525",
        maintenance: "Low maintenance, hybrid system warranty",
        tags: ["hybrid", "fuel-efficient", "eco-friendly", "hatchback", "reliable"]
      },
      {
        name: "Toyota Camry Hybrid",
        type: "Hybrid",
        brand: "Toyota",
        engine: "2.5L 4-cylinder + Electric Motor",
        mileage: "51 MPG city / 53 MPG highway",
        price: "$27,980",
        maintenance: "Low maintenance, hybrid system warranty",
        tags: ["hybrid", "fuel-efficient", "eco-friendly", "sedan", "family", "reliable"]
      },
      {
        name: "Honda Accord Hybrid",
        type: "Hybrid",
        brand: "Honda",
        engine: "2.0L 4-cylinder + Electric Motor",
        mileage: "48 MPG city / 47 MPG highway",
        price: "$27,720",
        maintenance: "Low maintenance, good resale value",
        tags: ["hybrid", "fuel-efficient", "eco-friendly", "sedan", "family", "reliable"]
      },
      {
        name: "Hyundai Ioniq Hybrid",
        type: "Hybrid",
        brand: "Hyundai",
        engine: "1.6L 4-cylinder + Electric Motor",
        mileage: "59 MPG city / 57 MPG highway",
        price: "$23,650",
        maintenance: "Low maintenance, great warranty",
        tags: ["hybrid", "fuel-efficient", "eco-friendly", "hatchback", "warranty"]
      },
      
      // SUVs
      {
        name: "Honda CR-V",
        type: "SUV",
        brand: "Honda",
        engine: "1.5L Turbo 4-cylinder",
        mileage: "28 MPG city / 34 MPG highway",
        price: "$26,400",
        maintenance: "Low maintenance costs, reliable",
        tags: ["suv", "family", "versatile", "compact-suv", "reliable"]
      },
      {
        name: "Toyota RAV4",
        type: "SUV",
        brand: "Toyota",
        engine: "2.5L 4-cylinder",
        mileage: "27 MPG city / 35 MPG highway",
        price: "$26,975",
        maintenance: "Low maintenance costs, reliable",
        tags: ["suv", "family", "versatile", "compact-suv", "reliable", "popular"]
      },
      {
        name: "Mazda CX-5",
        type: "SUV",
        brand: "Mazda",
        engine: "2.5L 4-cylinder",
        mileage: "25 MPG city / 31 MPG highway",
        price: "$26,250",
        maintenance: "Average maintenance costs, stylish",
        tags: ["suv", "family", "stylish", "compact-suv", "premium-feel"]
      },
      {
        name: "Ford Explorer",
        type: "SUV",
        brand: "Ford",
        engine: "2.3L Turbo 4-cylinder",
        mileage: "21 MPG city / 28 MPG highway",
        price: "$33,860",
        maintenance: "Moderate maintenance costs, spacious",
        tags: ["suv", "family", "spacious", "mid-size-suv", "three-rows"]
      },
      {
        name: "Jeep Grand Cherokee",
        type: "SUV",
        brand: "Jeep",
        engine: "3.6L V6",
        mileage: "19 MPG city / 26 MPG highway",
        price: "$36,495",
        maintenance: "Moderate maintenance costs, off-road capable",
        tags: ["suv", "off-road", "mid-size-suv", "premium", "capable"]
      },
      {
        name: "Chevrolet Tahoe",
        type: "SUV",
        brand: "Chevrolet",
        engine: "5.3L V8",
        mileage: "16 MPG city / 20 MPG highway",
        price: "$50,295",
        maintenance: "Higher maintenance costs, very spacious",
        tags: ["suv", "family", "spacious", "large-suv", "three-rows", "towing"]
      },
      
      // Trucks
      {
        name: "Ford F-150",
        type: "Truck",
        brand: "Ford",
        engine: "3.3L V6",
        mileage: "20 MPG city / 24 MPG highway",
        price: "$30,070",
        maintenance: "Moderate maintenance costs, durable",
        tags: ["truck", "utility", "powerful", "full-size", "best-seller"]
      },
      {
        name: "Ram 1500",
        type: "Truck",
        brand: "Ram",
        engine: "3.6L V6",
        mileage: "20 MPG city / 25 MPG highway",
        price: "$35,900",
        maintenance: "Moderate maintenance costs, comfortable ride",
        tags: ["truck", "utility", "comfortable", "full-size", "luxury-truck"]
      },
      {
        name: "Chevrolet Silverado",
        type: "Truck",
        brand: "Chevrolet",
        engine: "4.3L V6",
        mileage: "16 MPG city / 21 MPG highway",
        price: "$29,795",
        maintenance: "Moderate maintenance costs, durable",
        tags: ["truck", "utility", "durable", "full-size", "work-truck"]
      },
      {
        name: "Toyota Tacoma",
        type: "Truck",
        brand: "Toyota",
        engine: "2.7L 4-cylinder",
        mileage: "20 MPG city / 23 MPG highway",
        price: "$26,500",
        maintenance: "Low maintenance costs, reliable",
        tags: ["truck", "utility", "reliable", "mid-size", "off-road"]
      },
      
      // Luxury Vehicles
      {
        name: "BMW 3 Series",
        type: "Car",
        brand: "BMW",
        engine: "2.0L Turbo 4-cylinder",
        mileage: "26 MPG city / 36 MPG highway",
        price: "$41,250",
        maintenance: "Higher maintenance costs, premium performance",
        tags: ["sedan", "luxury", "performance", "premium", "sporty"]
      },
      {
        name: "Mercedes-Benz C-Class",
        type: "Car",
        brand: "Mercedes-Benz",
        engine: "2.0L Turbo 4-cylinder",
        mileage: "25 MPG city / 35 MPG highway",
        price: "$43,200",
        maintenance: "Higher maintenance costs, premium comfort",
        tags: ["sedan", "luxury", "comfort", "premium", "elegant"]
      },
      {
        name: "Audi A4",
        type: "Car",
        brand: "Audi",
        engine: "2.0L Turbo 4-cylinder",
        mileage: "26 MPG city / 34 MPG highway",
        price: "$39,400",
        maintenance: "Higher maintenance costs, premium technology",
        tags: ["sedan", "luxury", "technology", "premium", "quattro"]
      },
      {
        name: "Lexus ES",
        type: "Car",
        brand: "Lexus",
        engine: "3.5L V6",
        mileage: "22 MPG city / 32 MPG highway",
        price: "$40,900",
        maintenance: "Average maintenance costs, premium reliability",
        tags: ["sedan", "luxury", "reliable", "premium", "comfortable"]
      },
      {
        name: "BMW X5",
        type: "SUV",
        brand: "BMW",
        engine: "3.0L Turbo 6-cylinder",
        mileage: "21 MPG city / 25 MPG highway",
        price: "$60,600",
        maintenance: "Higher maintenance costs, premium SUV",
        tags: ["suv", "luxury", "performance", "premium", "mid-size-suv"]
      },
      {
        name: "Mercedes-Benz GLE",
        type: "SUV",
        brand: "Mercedes-Benz",
        engine: "2.0L Turbo 4-cylinder",
        mileage: "22 MPG city / 27 MPG highway",
        price: "$55,700",
        maintenance: "Higher maintenance costs, luxury SUV",
        tags: ["suv", "luxury", "comfort", "premium", "mid-size-suv"]
      },
      
      // Sports Cars
      {
        name: "Ford Mustang",
        type: "Car",
        brand: "Ford",
        engine: "2.3L EcoBoost 4-cylinder",
        mileage: "21 MPG city / 29 MPG highway",
        price: "$27,205",
        maintenance: "Moderate maintenance costs, performance",
        tags: ["sports-car", "performance", "muscle-car", "affordable", "fun-to-drive"]
      },
      {
        name: "Chevrolet Camaro",
        type: "Car",
        brand: "Chevrolet",
        engine: "2.0L Turbo 4-cylinder",
        mileage: "22 MPG city / 31 MPG highway",
        price: "$25,800",
        maintenance: "Moderate maintenance costs, performance",
        tags: ["sports-car", "performance", "muscle-car", "affordable", "fun-to-drive"]
      },
      {
        name: "Porsche 718 Cayman",
        type: "Car",
        brand: "Porsche",
        engine: "2.0L Turbo 4-cylinder",
        mileage: "24 MPG city / 32 MPG highway",
        price: "$60,500",
        maintenance: "Higher maintenance costs, premium sports car",
        tags: ["sports-car", "performance", "premium", "luxury", "handling"]
      },
      
      // Minivans
      {
        name: "Honda Odyssey",
        type: "Minivan",
        brand: "Honda",
        engine: "3.5L V6",
        mileage: "19 MPG city / 28 MPG highway",
        price: "$32,910",
        maintenance: "Average maintenance costs, family-friendly",
        tags: ["minivan", "family", "spacious", "practical", "reliable"]
      },
      {
        name: "Toyota Sienna",
        type: "Minivan",
        brand: "Toyota",
        engine: "3.5L V6",
        mileage: "19 MPG city / 27 MPG highway",
        price: "$34,460",
        maintenance: "Low maintenance costs, family-friendly",
        tags: ["minivan", "family", "spacious", "practical", "reliable"]
      },
      {
        name: "Chrysler Pacifica",
        type: "Minivan",
        brand: "Chrysler",
        engine: "3.6L V6",
        mileage: "19 MPG city / 28 MPG highway",
        price: "$35,045",
        maintenance: "Average maintenance costs, family-friendly",
        tags: ["minivan", "family", "spacious", "practical", "stow-and-go"]
      },
      
      // Convertibles
      {
        name: "Mazda MX-5 Miata",
        type: "Convertible",
        brand: "Mazda",
        engine: "2.0L 4-cylinder",
        mileage: "26 MPG city / 34 MPG highway",
        price: "$26,830",
        maintenance: "Average maintenance costs, fun-to-drive",
        tags: ["convertible", "sports-car", "fun-to-drive", "affordable", "lightweight"]
      },
      {
        name: "BMW Z4",
        type: "Convertible",
        brand: "BMW",
        engine: "2.0L Turbo 4-cylinder",
        mileage: "25 MPG city / 33 MPG highway",
        price: "$49,900",
        maintenance: "Higher maintenance costs, premium roadster",
        tags: ["convertible", "sports-car", "premium", "luxury", "roadster"]
      },
      
      // Motorcycles
      {
        name: "Harley-Davidson Iron 883",
        type: "Bike",
        brand: "Harley-Davidson",
        engine: "883cc Evolution",
        mileage: "51 MPG (combined)",
        price: "$9,999",
        maintenance: "Regular maintenance required, classic style",
        tags: ["motorcycle", "cruiser", "classic", "american", "v-twin"]
      },
      {
        name: "Honda Rebel 500",
        type: "Bike",
        brand: "Honda",
        engine: "471cc Parallel-twin",
        mileage: "67 MPG (combined)",
        price: "$6,199",
        maintenance: "Low maintenance, beginner-friendly",
        tags: ["motorcycle", "cruiser", "beginner", "affordable", "reliable"]
      },
      {
        name: "Kawasaki Ninja 400",
        type: "Bike",
        brand: "Kawasaki",
        engine: "399cc Parallel-twin",
        mileage: "49 MPG (combined)",
        price: "$5,299",
        maintenance: "Average maintenance, sport bike",
        tags: ["motorcycle", "sport-bike", "beginner", "affordable", "performance"]
      }
    ];
    
    // Insert vehicles
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