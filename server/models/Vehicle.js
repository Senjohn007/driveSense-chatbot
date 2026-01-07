import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    type: { 
      type: String, 
      enum: ["Car", "Bike", "Truck", "EV", "SUV", "Hybrid"], 
      required: true 
    },
    brand: String,
    engine: String,
    mileage: String,
    price: String,
    maintenance: String,
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);