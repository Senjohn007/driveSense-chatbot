import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Vehicle from "../models/Vehicle.js";

dotenv.config();

const vehicles = [
  {
    name: "Toyota Corolla",
    type: "Car",
    brand: "Toyota",
    engine: "1.8L Petrol",
    mileage: "30 mpg",
    price: "$20,000",
    maintenance: "Oil change every 5000 km; regular servicing every 10,000 km.",
    tags: ["sedan", "reliable", "family"]
  },
  {
    name: "Honda Civic",
    type: "Car",
    brand: "Honda",
    engine: "2.0L Petrol",
    mileage: "32 mpg",
    price: "$22,000",
    maintenance: "Oil change every 6000 km; inspect brakes yearly.",
    tags: ["sedan", "sporty"]
  }
];

const run = async () => {
  await connectDB();
  await Vehicle.deleteMany({});
  await Vehicle.insertMany(vehicles);
  console.log("Seeded vehicles");
  process.exit(0);
};

run();
