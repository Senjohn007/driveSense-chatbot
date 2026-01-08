import express from "express";
import Vehicle from "../models/Vehicle.js";
import Message from "../models/Message.js";
// import { openai } from "../config/openai.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Helper function to extract vehicle keywords from user message
const extractVehicleKeywords = (message) => {
  const keywords = [];
  const lowerMessage = message.toLowerCase();
  
  // Extract vehicle types - added "motorcycles" and improved plural handling
  const vehicleTypes = ["car", "cars", "bike", "bikes", "motorcycle", "motorcycles", "truck", "trucks", "ev", "electric", "suv", "suvs", 
                       "sedan", "sedans", "hatchback", "hybrid", "minivan", "convertible", "sports car", "cruiser", "sport-bike"];
  vehicleTypes.forEach(type => {
    if (lowerMessage.includes(type)) {
      // Normalize singular forms for database matching
      if (type === "bikes" || type === "motorcycles") keywords.push("bike");
      else if (type === "cars" || type === "sedans") keywords.push("car");
      else if (type === "trucks") keywords.push("truck");
      else if (type === "suvs") keywords.push("suv");
      else keywords.push(type);
    }
  });
  
  // Extract common brands (expanded list)
  const brands = ["toyota", "honda", "ford", "bmw", "mercedes", "mercedes-benz", "tesla", "hyundai", "nissan", 
                  "mazda", "volkswagen", "audi", "chevrolet", "chevy", "jeep", "kia", "harley-davidson", 
                  "porsche", "chrysler", "ram", "dodge", "subaru", "lexus", "acura", "infiniti", "volvo", 
                  "land rover", "jaguar", "lincoln", "cadillac", "buick", "gmc", "mitsubishi"];
  brands.forEach(brand => {
    if (lowerMessage.includes(brand)) {
      keywords.push(brand);
    }
  });
  
  // Extract vehicle models (expanded list)
  const models = ["corolla", "civic", "camry", "accord", "model 3", "model y", "f-150", 
                  "cr-v", "prius", "mustang", "explorer", "escape", "silverado", "iron 883",
                  "altima", "sonata", "jetta", "mazda3", "leaf", "bolt", "mach-e", "rav4",
                  "cx-5", "tahoe", "tacoma", "x5", "gle", "odyssey", "sienna", "pacifica",
                  "mx-5", "miata", "z4", "rebel", "ninja", "3 series", "c-class", "a4", "es",
                  "camaro", "cayman", "grand cherokee", "explorer"];
  models.forEach(model => {
    if (lowerMessage.includes(model)) {
      keywords.push(model);
    }
  });
  
  // Extract price range keywords
  const priceKeywords = ["under $20k", "under $30k", "under $40k", "budget", "affordable", "cheap", 
                        "expensive", "luxury", "premium", "mid-range"];
  priceKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  // Extract feature keywords
  const featureKeywords = ["fuel efficient", "mileage", "mpg", "reliable", "family", "spacious", 
                          "off-road", "performance", "sport", "comfort", "technology", "safety",
                          "towing", "cargo", "all-wheel drive", "awd", "four-wheel drive", "4wd"];
  featureKeywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) {
      keywords.push(keyword);
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

// NEW: Helper function to generate a vehicle card response
const generateVehicleCard = (vehicle) => {
  return {
    type: "vehicle_card",
    data: {
      name: vehicle.name,
      brand: vehicle.brand,
      engine: vehicle.engine,
      mileage: vehicle.mileage,
      price: vehicle.price,
      maintenance: vehicle.maintenance,
      type: vehicle.type,
      tags: vehicle.tags
    }
  };
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

// New helper functions for specific response types
const generateFamilyResponse = (vehicles) => {
  const familyVehicles = vehicles.filter(v => 
    v.tags.includes("family") || v.tags.includes("spacious") || 
    v.tags.includes("minivan") || v.tags.includes("three-rows")
  );
  
  if (familyVehicles.length === 0) {
    return "For families, I typically recommend minivans, SUVs with three rows, or spacious sedans. These vehicles offer ample cargo space, comfortable seating for multiple passengers, and family-friendly features. Would you like specific recommendations in any of these categories?";
  }
  
  let response = `Here are some great family vehicles:\n`;
  familyVehicles.forEach(v => {
    response += `${v.name}: ${v.type} with ${v.mileage}, priced at ${v.price}\n`;
  });
  
  response += `\nFor families with multiple children, minivans like the Honda Odyssey or three-row SUVs like the Ford Explorer offer the most space and flexibility.`;
  
  return response;
};

const generateOffroadResponse = (vehicles) => {
  const offroadVehicles = vehicles.filter(v => 
    v.tags.includes("off-road") || v.tags.includes("4wd") || 
    v.tags.includes("awd") || v.name.includes("Jeep")
  );
  
  if (offroadVehicles.length === 0) {
    return "For off-road capability, I recommend looking at vehicles with 4WD systems, higher ground clearance, and rugged construction. Jeep models, certain trucks, and specialized SUVs are typically best suited for off-road adventures. Would you like specific recommendations?";
  }
  
  let response = `Here are some vehicles with good off-road capabilities:\n`;
  offroadVehicles.forEach(v => {
    response += `${v.name}: ${v.type} with ${v.engine}, priced at ${v.price}\n`;
  });
  
  response += `\nThe Jeep Grand Cherokee is particularly known for its off-road prowess, while trucks like the Toyota Tacoma offer excellent trail capability.`;
  
  return response;
};

const generateLuxuryResponse = (vehicles) => {
  const luxuryVehicles = vehicles.filter(v => 
    v.tags.includes("luxury") || v.tags.includes("premium") || 
    ["BMW", "Mercedes", "Mercedes-Benz", "Audi", "Lexus", "Porsche"].includes(v.brand)
  );
  
  if (luxuryVehicles.length === 0) {
    return "For a luxury experience, consider brands like BMW, Mercedes-Benz, Audi, Lexus, or Porsche. These vehicles offer premium materials, advanced technology, superior comfort, and enhanced performance. Would you like recommendations in a specific category?";
  }
  
  let response = `Here are some luxury vehicle options:\n`;
  luxuryVehicles.forEach(v => {
    response += `${v.name}: ${v.type} with ${v.engine}, priced at ${v.price}\n`;
  });
  
  response += `\nKeep in mind that luxury vehicles typically have higher maintenance costs, but offer superior comfort, technology, and driving experience.`;
  
  return response;
};

const generateBudgetResponse = (vehicles) => {
  const budgetVehicles = vehicles.filter(v => {
    const price = parseFloat(v.price.replace(/[^0-9.-]+/g, ""));
    return price < 30000 || v.tags.includes("budget-friendly") || v.tags.includes("affordable");
  });
  
  if (budgetVehicles.length === 0) {
    return "For budget-friendly options, consider compact cars like the Toyota Corolla or Honda Civic, which offer excellent value, reliability, and fuel efficiency. Would you like specific recommendations under a certain price point?";
  }
  
  let response = `Here are some budget-friendly vehicles:\n`;
  budgetVehicles.forEach(v => {
    response += `${v.name}: ${v.type} with ${v.mileage}, priced at ${v.price}\n`;
  });
  
  response += `\nThe Toyota Corolla and Honda Civic are particularly known for offering excellent value with low maintenance costs and good fuel economy.`;
  
  return response;
};

const generateEcoResponse = (vehicles) => {
  const ecoVehicles = vehicles.filter(v => 
    v.type === "EV" || v.type === "Hybrid" || v.tags.includes("eco-friendly")
  );
  
  if (ecoVehicles.length === 0) {
    return "For eco-friendly options, consider electric vehicles (EVs) or hybrids. EVs produce zero emissions while hybrids offer excellent fuel efficiency. Would you like specific recommendations in either category?";
  }
  
  let response = `Here are some eco-friendly vehicles:\n`;
  ecoVehicles.forEach(v => {
    response += `${v.name}: ${v.type} with ${v.mileage}, priced at ${v.price}\n`;
  });
  
  response += `\nThe Toyota Prius offers exceptional fuel efficiency as a hybrid, while the Tesla Model 3 provides a premium electric experience with zero emissions.`;
  
  return response;
};

// New helper function for motorcycle-specific responses
const generateMotorcycleResponse = (vehicles) => {
  const motorcycles = vehicles.filter(v => v.type === "Bike" || v.tags.includes("motorcycle"));
  
  if (motorcycles.length === 0) {
    return "I don't have specific information about motorcycles in my database. Motorcycles offer excellent fuel efficiency and a unique riding experience. They come in various styles including cruisers, sport bikes, and touring bikes. Would you like information about a specific motorcycle brand or type?";
  }
  
  let response = `Here are the motorcycles in my database:\n`;
  motorcycles.forEach(v => {
    response += `${v.name}: ${v.type} with ${v.engine}, mileage of ${v.mileage}, priced at ${v.price}\n`;
    response += `   Maintenance: ${v.maintenance}\n`;
  });
  
  response += `\nMotorcycles require different riding skills and safety considerations compared to cars. Always wear proper safety gear and consider taking a motorcycle safety course.`;
  
  return response;
};

// Main response generation function
const generateResponse = (message, vehicles, isCompare) => {
  const lowerMessage = message.toLowerCase();
  
  // Handle comparison requests
  if (isCompare && vehicles.length >= 2) {
    return generateComparison(vehicles);
  }
  
  // Handle motorcycle-specific queries
  if (lowerMessage.includes("motorcycle") || lowerMessage.includes("motorcycles") || 
      lowerMessage.includes("bike") || lowerMessage.includes("bikes")) {
    return generateMotorcycleResponse(vehicles);
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
  
  // Handle family vehicle requests
  if (lowerMessage.includes("family") || lowerMessage.includes("kids") || 
      lowerMessage.includes("spacious") || lowerMessage.includes("room")) {
    return generateFamilyResponse(vehicles);
  }
  
  // Handle off-road requests
  if (lowerMessage.includes("off-road") || lowerMessage.includes("offroad") || 
      lowerMessage.includes("trail") || lowerMessage.includes("rugged")) {
    return generateOffroadResponse(vehicles);
  }
  
  // Handle luxury/premium requests
  if (lowerMessage.includes("luxury") || lowerMessage.includes("premium") || 
      lowerMessage.includes("high-end")) {
    return generateLuxuryResponse(vehicles);
  }
  
  // Handle budget/affordable requests
  if (lowerMessage.includes("cheap") || lowerMessage.includes("affordable") || 
      lowerMessage.includes("budget") || lowerMessage.includes("inexpensive")) {
    return generateBudgetResponse(vehicles);
  }
  
  // Handle eco-friendly requests
  if (lowerMessage.includes("eco") || lowerMessage.includes("environment") || 
      lowerMessage.includes("green")) {
    return generateEcoResponse(vehicles);
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
  
  // NEW: Handle detailed vehicle information requests
  if (lowerMessage.includes("tell me about") || lowerMessage.includes("show me") || 
      lowerMessage.includes("details") || lowerMessage.includes("information") ||
      (lowerMessage.includes("what is") && vehicles.length === 1)) {
    if (vehicles.length === 1) {
      // Return a vehicle card for a single vehicle match
      return generateVehicleCard(vehicles[0]);
    } else if (vehicles.length > 1) {
      // If multiple vehicles match, return a text response with options
      let response = `I found multiple vehicles matching your query. Which one would you like detailed information about?\n\n`;
      vehicles.forEach((v, i) => {
        response += `${i+1}. ${v.name} (${v.type}) by ${v.brand}\n`;
      });
      return response;
    }
  }
  
  // Default response with available vehicles
  if (vehicles.length > 0) {
    const v = vehicles[0];
    return `Based on the database, ${v.name} is a ${v.type} by ${v.brand} with ${v.engine}, mileage of ${v.mileage}, and price around ${v.price}. Maintenance: ${v.maintenance}\n\nIs there something specific you'd like to know about this vehicle?`;
  }
  
  // If no vehicles found, provide a list of available vehicle types
  return `I couldn't find specific information about that vehicle. Here are some vehicle types I can help you with:\n\n` +
    `• Cars (sedans, hatchbacks, sports cars)\n` +
    `• SUVs (compact, mid-size, large)\n` +
    `• Trucks (full-size, mid-size)\n` +
    `• Electric Vehicles (EVs)\n` +
    `• Hybrid Vehicles\n` +
    `• Minivans\n` +
    `• Convertibles\n` +
    `• Motorcycles\n\n` +
    `You can ask me about specific models, compare vehicles, or get recommendations based on your needs (budget, family, performance, etc.).`;
};

// Main chat route
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
        
      // If we're looking for a specific type (like SUVs, motorcycles, etc.) and got no results,
      // try a more direct type match
      if (vehicles.length === 0 && keywords.some(k => ["suv", "bike", "car", "truck", "ev", "hybrid"].includes(k))) {
        const typeKeyword = keywords.find(k => ["suv", "bike", "car", "truck", "ev", "hybrid"].includes(k));
        vehicles = await Vehicle.find({ type: { $regex: typeKeyword, $options: "i" } })
          .limit(5)
          .lean();
      }
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