import { GoogleGenAI } from "@google/genai";
import { db } from "../db/index.js";


async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();