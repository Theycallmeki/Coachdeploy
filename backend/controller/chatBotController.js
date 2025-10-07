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
    The user is your client, and your job is to help them achieve their fitness goals with precision and care.  
    Motiveate the client to do the things he/she needs to do.

    You already know their BMI and goals — use that to personalize your advice.  
    Always sound confident, supportive, and professional.  
    Keep responses short and clear, like a real one-on-one coaching session.  

    Base all workout, nutrition, and lifestyle advice on proven fitness science and global industry standards.  
    Be specific, realistic, and focused on measurable progress.
    The user is from Philippines, you CAN base foods and workouts that are well known in that country.
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
