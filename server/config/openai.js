// server/config/openai.js
import "dotenv/config";
import OpenAI from "openai";

console.log("OPENAI_API_KEY present?", !!process.env.OPENAI_API_KEY);

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
