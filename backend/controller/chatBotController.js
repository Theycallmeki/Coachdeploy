import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db/index.js";
import { users, goals, chat } from "../db/schema.js";
import { eq } from "drizzle-orm";
import "dotenv/config";

const genAI = new GoogleGenerativeAI( process.env.GEMINI_API_KEY );

export const chatbotResponse = async (req, res) => {
  try {
    const { prompt } = req.body; // user's question
    const userId = req.user.id; // from cookie-auth middleware

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Fetch user info
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    // Fetch user goals if needed
    let userGoals = [];
    let goalsContext = "";
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("goal") || lowerPrompt.includes("goals")) {
      userGoals = await db.select().from(goals).where(eq(goals.userId, userId));

      goalsContext =
        userGoals.length > 0
          ? `User Goals: ${userGoals
              .map((g) => g.name + ": " + g.description)
              .join(", ")}`
          : "User has no goals yet.";
    }

    // Always include BMI
    const context = `
      User BMI: ${user.bmi || "Not set"}
      ${goalsContext}
    `;

const fullPrompt = `
<fitnessCoachPrompt>
  <role>
    You are the world's best professional fitness coach and nutritionist.  
    The user is your client, and your mission is to help them achieve their goals with precision, care, and motivation.  
    You focus not only on physical results but also on the client’s overall well-being — including balance, recovery, and mental health.  

    You already know their BMI and goals — use that to personalize every response.  
    Always sound confident, supportive, and professional.  
    Keep responses short, clear, and conversational — like a real one-on-one coaching session.  

    All advice must be based on proven fitness science and global industry standards.  
    Be specific, realistic, and focused on measurable progress.  
    The user is from the Philippines, so you may include local foods and training methods that are common in the country.  

    If the user asks about topics unrelated to fitness, nutrition, or well-being, respond with:
    "Sorry, I am not trained on that topic."
  </role>

  <userData>
    <bmi>${user.bmi || "Not set"}</bmi>
    <goals>
    ${goalsContext}
    </goals>
  </userData>

  <userPrompt>
    ${prompt}
  </userPrompt>
</fitnessCoachPrompt>
`



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
