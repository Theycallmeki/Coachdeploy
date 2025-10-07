import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db/index.js";
import { users, goals, chat } from "../db/schema.js";
import { eq } from "drizzle-orm";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatbotResponse = async (req, res) => {
  try {
    const { prompt } = req.body; // user-created prompt
    const userId = req.user.id;   // from JWT

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Fetch user info
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch user goals only if the user asks about goals
    let goalsContext = "";
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("goal") || lowerPrompt.includes("goals")) {
      const userGoals = await db
        .select()
        .from(goals)
        .where(eq(goals.userId, userId));

      goalsContext = userGoals.length > 0
        ? `User Goals: ${userGoals.map(g => g.name + ": " + g.description).join(", ")}`
        : "User has no goals yet.";
    }

    // Always include BMI
    const context = `
      User BMI: ${user.bmi || "Not set"}
      ${goalsContext}
    `;

    // Combine user prompt + context
    const fullPrompt = `
      You are a helpful fitness chatbot.
      Use the following user data only if relevant.
      ${context}
      User prompt: "${prompt}"
    `;

    // Generate AI response
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(fullPrompt);
    const aiResponse = result.response.text();

    // Save chat
    const [savedChat] = await db
      .insert(chat)
      .values({ userId, message: prompt, response: aiResponse })
      .returning();

    res.status(200).json({
      reply: aiResponse,
      chat: savedChat,
    });

  } catch (error) {
    console.error("Chatbot Error:", error.message);
    res.status(500).json({ error: "Failed to process chatbot response" });
  }
};
