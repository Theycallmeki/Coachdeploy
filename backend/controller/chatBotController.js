import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db/index.js"
import { users, goals, chat } from "../db/schema.js"
import { eq } from "drizzle-orm"
import 'dotenv/config'


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatbotResponse = async (req, res) => {
  try {
    const { userId, message } = req.body

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" })
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId))

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const userGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))

    const context = `
      User Info:
      - BMI: ${user.bmi || "Not set"}
      - Goals: ${
        userGoals.length > 0
          ? userGoals.map((g) => g.name + ": " + g.description).join(", ")
          : "No goals yet."
      }
    `

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `
      You are a helpful fitness chatbot.
      Use the following user data to make your response relevant.
      ${context}
      User message: "${message}"
    `

    const result = await model.generateContent(prompt)
    const aiResponse = result.response.text()

    const [savedChat] = await db
      .insert(chat)
      .values({ userId, message, response: aiResponse })
      .returning()

    res.status(200).json({
      reply: aiResponse,
      chat: savedChat,
    })
  } catch (error) {
    console.error("Chatbot Error:", error.message)
    res.status(500).json({ error: "Failed to process chatbot response" })
  }
}
