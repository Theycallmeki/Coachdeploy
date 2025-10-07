import { GoogleGenAI } from "@google/genai";
import { db } from "../db/index.js";
import { chat } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getChats = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("userId:", userId); 
        
        if (!userId) {
            return res.status(400).json({ error: "userId is required"})
        }

        const userChats = await db
        .select()
        .from(chat)
        .where(eq(chat.userId, userId))

        return res.status(200).json(userChats)
    } catch (error) {
        console.error("Get Chats Error:", error)
        res.status(500).json({ error: "Failed to fetch chats"})
    }
}

export const createChat = async (req, res) => {
  try {
    const { userId, message, response } = req.body;

    if (!userId || !message || !response) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newChat = await db
      .insert(chat)
      .values({ userId, message, response })
      .returning();

    res.status(201).json(newChat[0]);
  } catch (error) {
    console.error("Create Chat Error:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Chat ID is required" });
    }

    await db.delete(chat).where(eq(chat.id, id));

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};
