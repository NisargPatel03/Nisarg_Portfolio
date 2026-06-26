import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Load .env file
const envText = fs.readFileSync(".env", "utf8");
console.log("=== .env File Contents ===");
console.log(envText);

const match = envText.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : "";

console.log("Extracted Key length:", apiKey.length);
console.log("Extracted Key prefix:", apiKey.substring(0, 10));

if (!apiKey) {
  console.error("No VITE_GEMINI_API_KEY found in .env");
  process.exit(1);
}

try {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("Sending test prompt to Gemini...");
  const result = await model.generateContent("Hello, respond in one short sentence.");
  const response = await result.response;
  console.log("=== Response ===");
  console.log(response.text());
} catch (err) {
  console.error("=== Error Occurred ===");
  console.error(err);
}
