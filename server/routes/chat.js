import express from "express";
import Vehicle from "../models/Vehicle.js";
import Message from "../models/Message.js";
// import { openai } from "../config/openai.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;

    const sessionId = clientSessionId || uuidv4();

    const query = message;

    const lower = message.toLowerCase();

    const possibleQueries = [];
if (lower.includes("toyota")) possibleQueries.push("toyota");
if (lower.includes("corolla")) possibleQueries.push("corolla");
if (lower.includes("honda")) possibleQueries.push("honda");
if (lower.includes("civic")) possibleQueries.push("civic");


const regexes = possibleQueries.map(q => new RegExp(q, "i"));

const vehicles = await Vehicle.find({
  $or: [
    { name: { $in: regexes } },
    { brand: { $in: regexes } },
    { type: { $in: regexes } },
    { tags: { $in: regexes } },
  ],
})
  .limit(5)
  .lean();
  
    // 7.1: better retrieval by name, brand, type, tags
    // const vehicles = await Vehicle.find({
    //   $or: [
    //     { name: { $regex: query, $options: "i" } },
    //     { brand: { $regex: query, $options: "i" } },
    //     { type: { $regex: query, $options: "i" } },
    //     { tags: { $in: [new RegExp(query, "i")] } },
    //   ],
    // })
    //   .limit(5)
    //   .lean();

    // 7.2: comparison detection
    const isCompare = /compare|vs|versus/i.test(message);

    let vehicleContext;

    if (isCompare && vehicles.length >= 2) {
      vehicleContext =
        "Comparison mode:\n" +
        vehicles
          .map(
            (v, i) =>
              `Vehicle ${i + 1}: ${v.name} (${v.type}) by ${v.brand}. Engine: ${
                v.engine
              }. Mileage: ${v.mileage}. Price: ${v.price}. Maintenance: ${
                v.maintenance
              }`
          )
          .join("\n\n");
    } else if (vehicles.length > 0) {
      vehicleContext = vehicles
        .map(
          v =>
            `${v.name} (${v.type}) by ${v.brand}. Engine: ${v.engine}. Mileage: ${v.mileage}. Price: ${v.price}. Maintenance: ${v.maintenance}`
        )
        .join("\n\n");
    } else {
      vehicleContext = "No specific vehicle matches found in database.";
    }

    const systemPrompt = `
You are an automobile expert chatbot.
Use the provided vehicle data when relevant, including for comparisons between multiple vehicles.
If data is missing, answer generally but clearly say it's a general estimate.
Be concise and beginner friendly.`;

    const userPrompt = `
Vehicle data:
${vehicleContext}

User question:
${message}
`;

        // TEMPORARY: stubbed reply instead of real OpenAI call
    let reply;

    if (isCompare && vehicles.length >= 2) {
      reply =
        "Here is a rough comparison based on the database data:\n\n" +
        vehicles
          .map(
            (v, i) =>
              `Vehicle ${i + 1}: ${v.name} (${v.type}) by ${v.brand}. Mileage: ${v.mileage}. Price: ${v.price}. Maintenance notes: ${v.maintenance}`
          )
          .join("\n\n") +
        "\n\nIn general, pick the one that best matches your budget and comfort, and keep up with regular maintenance.";
    } else if (vehicles.length > 0) {
      const v = vehicles[0];
      reply = `Based on the database, ${v.name} is a ${v.type} by ${v.brand} with ${v.engine}, mileage of ${v.mileage}, and price around ${v.price}. Maintenance: ${v.maintenance}`;
    } else {
      reply =
        "I cannot find that vehicle in the database yet, but in general you should compare engine size, mileage, price, and maintenance costs when choosing a vehicle.";
    }


    await Message.insertMany([
      { sessionId, role: "user", content: message },
      { sessionId, role: "assistant", content: reply },
    ]);

    res.json({ reply, sessionId });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Chat error" });
  }
  
});

export default router;
