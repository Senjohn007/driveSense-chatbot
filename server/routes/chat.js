import express from "express";
import Vehicle from "../models/Vehicle.js";
import Message from "../models/Message.js";
import { openai } from "../config/openai.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;

    const sessionId = clientSessionId || uuidv4();

    // 1) naive vehicle search by name / keyword
    const vehicles = await Vehicle.find({
      name: { $regex: message, $options: "i" }
    }).limit(3);

    const vehicleContext =
      vehicles.length > 0
        ? vehicles
            .map(
              (v) =>
                `${v.name} (${v.type}) by ${v.brand}. Engine: ${v.engine}. Mileage: ${v.mileage}. Price: ${v.price}. Maintenance: ${v.maintenance}`
            )
            .join("\n\n")
        : "No specific vehicle matches found in database.";

    const systemPrompt = `
You are an automobile expert chatbot.
Use the provided vehicle data when relevant.
If data is missing, answer generally but clearly say it's a general estimate.
Be concise and beginner friendly.`;

    const userPrompt = `
Vehicle data:
${vehicleContext}

User question:
${message}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    const reply = completion.choices[0].message.content;

    // Save chat history
    await Message.insertMany([
      { sessionId, role: "user", content: message },
      { sessionId, role: "assistant", content: reply }
    ]);

    res.json({ reply, sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat error" });
  }
});

export default router;
