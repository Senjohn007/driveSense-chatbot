import express from "express";
import Vehicle from "../models/Vehicle.js";
import Message from "../models/Message.js";
// import { openai } from "../config/openai.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Helper function to extract vehicle keywords from user message
// In server/routes/chat.js, update the extractVehicleKeywords function
const extractVehicleKeywords = (message) => {
  const keywords = [];
  const lowerMessage = message.toLowerCase();
  
  // Extract vehicle types
  const vehicleTypes = ["car", "bike", "truck", "ev", "electric", "suv", "sedan", "hatchback", "hybrid"];
  vehicleTypes.forEach(type => {
    if (lowerMessage.includes(type)) {
      keywords.push(type);
    }
  });
  
  // Extract common brands (expanded list)
  const brands = ["toyota", "honda", "ford", "bmw", "mercedes", "tesla", "hyundai", "nissan", 
                  "mazda", "volkswagen", "audi", "chevrolet", "jeep", "kia", "harley-davidson"];
  brands.forEach(brand => {
    if (lowerMessage.includes(brand)) {
      keywords.push(brand);
    }
  });
  
  // Extract vehicle models (expanded list)
  const models = ["corolla", "civic", "camry", "accord", "model 3", "model y", "f-150", 
                  "cr-v", "prius", "mustang", "explorer", "escape", "silverado", "iron 883"];
  models.forEach(model => {
    if (lowerMessage.includes(model)) {
      keywords.push(model);
    }
  });
  
  // If no specific keywords found, try to extract any capitalized words that might be vehicle names
  if (keywords.length === 0) {
    const capitalizedWords = message.match(/\b[A-Z][a-z]+\b/g);
    if (capitalizedWords) {
      keywords.push(...capitalizedWords);
    }
  }
  
  return keywords;
};

// Add this function to generate responses based on rules
// In server/routes/chat.js, update the generateResponse function
const generateResponse = (message, vehicles, isCompare) => {
  const lowerMessage = message.toLowerCase();
  
  // Handle comparison requests
  if (isCompare && vehicles.length >= 2) {
    return generateComparison(vehicles);
  }
  
  // Handle specific attribute questions
  if (lowerMessage.includes("mileage") || lowerMessage.includes("fuel efficiency") || 
      lowerMessage.includes("mpg") || lowerMessage.includes("gas mileage")) {
    return generateMileageResponse(vehicles);
  }
  
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || 
      lowerMessage.includes("afford") || lowerMessage.includes("budget")) {
    return generatePriceResponse(vehicles);
  }
  
  if (lowerMessage.includes("maintenance") || lowerMessage.includes("service") || 
      lowerMessage.includes("repair")) {
    return generateMaintenanceResponse(vehicles);
  }
  
  if (lowerMessage.includes("engine") || lowerMessage.includes("performance") || 
      lowerMessage.includes("power") || lowerMessage.includes("acceleration")) {
    return generateEngineResponse(vehicles);
  }
  
  // Handle recommendations
  if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest") || 
      lowerMessage.includes("what should") || lowerMessage.includes("which is better")) {
    if (vehicles.length > 0) {
      const v = vehicles[0];
      return `Based on your query, I'd recommend considering the ${v.name}. It's a ${v.type} by ${v.brand} with ${v.engine}, mileage of ${v.mileage}, and price around ${v.price}. Maintenance: ${v.maintenance}\n\nFor a more specific recommendation, let me know your budget, preferred vehicle type, or what features matter most to you.`;
    } else {
      return "To give you a good recommendation, I need to know more about your preferences. Could you tell me about your budget, preferred vehicle type, or what features are important to you?";
    }
  }
  
  // Default response with available vehicles
  if (vehicles.length > 0) {
    const v = vehicles[0];
    return `Based on the database, ${v.name} is a ${v.type} by ${v.brand} with ${v.engine}, mileage of ${v.mileage}, and price around ${v.price}. Maintenance: ${v.maintenance}\n\nIs there something specific you'd like to know about this vehicle?`;
  }
  
  // If no vehicles found, provide a list of available vehicles
  return `I couldn't find specific information about that vehicle. Here are some vehicles I can help you with:\n\n` +
    `1. Toyota Corolla\n` +
    `2. Honda Civic\n` +
    `3. Tesla Model 3\n` +
    `4. Ford F-150\n` +
    `5. BMW 3 Series\n` +
    `6. Honda CR-V\n` +
    `7. Toyota Prius\n` +
    `8. Harley-Davidson Iron 883\n\n` +
    `You can ask me about any of these vehicles by name, or ask about specific types like "SUVs", "electric vehicles", or "trucks".`;
};

// Helper functions for specific response types
const generateComparison = (vehicles) => {
  let comparison = "Here's a comparison based on the database data:\n\n";
  
  vehicles.forEach((v, i) => {
    comparison += `${i+1}. ${v.name} (${v.type}) by ${v.brand}\n`;
    comparison += `   Mileage: ${v.mileage}\n`;
    comparison += `   Price: ${v.price}\n`;
    comparison += `   Maintenance: ${v.maintenance}\n\n`;
  });
  
  // Add recommendation based on attributes
  const bestMileage = vehicles.reduce((best, current) => {
    const currentMpg = parseFloat(current.mileage.match(/\d+/)?.[0] || 0);
    const bestMpg = parseFloat(best.mileage.match(/\d+/)?.[0] || 0);
    return currentMpg > bestMpg ? current : best;
  });
  
  const lowestPrice = vehicles.reduce((lowest, current) => {
    const currentPrice = parseFloat(current.price.replace(/[^0-9.-]+/g, ""));
    const lowestPriceVal = parseFloat(lowest.price.replace(/[^0-9.-]+/g, ""));
    return currentPrice < lowestPriceVal ? current : lowest;
  });
  
  comparison += `If mileage is your priority, consider the ${bestMileage.name} with ${bestMileage.mileage}.\n`;
  comparison += `If budget is your main concern, the ${lowestPrice.name} at ${lowestPrice.price} is most affordable.\n`;
  comparison += `For more personalized advice, let me know your specific needs and preferences.`;
  
  return comparison;
};

const generateMileageResponse = (vehicles) => {
  if (vehicles.length === 0) {
    return "I don't have specific mileage data for that vehicle. In general, smaller cars and EVs tend to have better mileage than larger vehicles. Hybrids also typically offer excellent fuel efficiency.";
  }
  
  const sortedByMileage = [...vehicles].sort((a, b) => {
    const aMpg = parseFloat(a.mileage.match(/\d+/)?.[0] || 0);
    const bMpg = parseFloat(b.mileage.match(/\d+/)?.[0] || 0);
    return bMpg - aMpg;
  });
  
  let response = `Here's the mileage information:\n`;
  sortedByMileage.forEach(v => {
    response += `${v.name}: ${v.mileage}\n`;
  });
  
  response += `\nThe ${sortedByMileage[0].name} has the best mileage at ${sortedByMileage[0].mileage}.`;
  
  return response;
};

const generatePriceResponse = (vehicles) => {
  if (vehicles.length === 0) {
    return "I don't have specific pricing for that vehicle. Prices vary based on trim level, features, and location. Consider your budget and what features are most important to you.";
  }
  
  const sortedByPrice = [...vehicles].sort((a, b) => {
    const aPrice = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
    const bPrice = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
    return aPrice - bPrice;
  });
  
  let response = `Here's the pricing information:\n`;
  sortedByPrice.forEach(v => {
    response += `${v.name}: ${v.price}\n`;
  });
  
  response += `\nThe ${sortedByPrice[0].name} is the most affordable at ${sortedByPrice[0].price}.`;
  
  return response;
};

const generateMaintenanceResponse = (vehicles) => {
  if (vehicles.length === 0) {
    return "Regular maintenance is crucial for any vehicle. This includes oil changes, tire rotations, brake inspections, and following the manufacturer's recommended service schedule. EVs typically require less maintenance than traditional vehicles.";
  }
  
  let response = `Maintenance information:\n`;
  vehicles.forEach(v => {
    response += `${v.name}: ${v.maintenance}\n`;
  });
  
  response += `\nRemember that maintenance costs can vary based on driving conditions and how well the vehicle is cared for.`;
  
  return response;
};

const generateEngineResponse = (vehicles) => {
  if (vehicles.length === 0) {
    return "Engine specifications vary widely between vehicles. Consider your needs - city driving might benefit from a smaller engine or hybrid, while highway driving might need more power. EVs offer instant torque and smooth acceleration.";
  }
  
  let response = `Engine information:\n`;
  vehicles.forEach(v => {
    response += `${v.name}: ${v.engine}\n`;
  });
  
  return response;
};

// Main chat route
// In server/routes/chat.js, update the main route
router.post("/", async (req, res) => {
  try {
    const { message, sessionId: clientSessionId } = req.body;

    const sessionId = clientSessionId || uuidv4();

    // Extract keywords from the message
    let keywords = extractVehicleKeywords(message);
    
    // If no keywords found, try a more general search
    if (keywords.length === 0) {
      // Try to find any vehicle that might match the message
      const generalSearch = await Vehicle.find({
        $or: [
          { name: { $regex: message, $options: "i" } },
          { brand: { $regex: message, $options: "i" } },
          { type: { $regex: message, $options: "i" } },
          { tags: { $in: [new RegExp(message, "i")] } },
        ],
      })
        .limit(5)
        .lean();
      
      // If we found vehicles with the general search, use them
      if (generalSearch.length > 0) {
        var vehicles = generalSearch;
      } else {
        // If still no vehicles, get a random sample to show the user what's available
        vehicles = await Vehicle.find().limit(3).lean();
      }
    } else {
      // Create regex patterns for searching
      const regexes = keywords.map(k => new RegExp(k, "i"));

      // Find matching vehicles
      var vehicles = await Vehicle.find({
        $or: [
          { name: { $in: regexes } },
          { brand: { $in: regexes } },
          { type: { $in: regexes } },
          { tags: { $in: regexes } },
        ],
      })
        .limit(5)
        .lean();
    }

    // Check if this is a comparison request
    const isCompare = /compare|vs|versus/i.test(message);

    // Generate response using rule-based system
    const reply = generateResponse(message, vehicles, isCompare);

    // Save conversation to database
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