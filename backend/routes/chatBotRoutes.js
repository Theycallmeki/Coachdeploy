import express from "express";
import { chatbotResponse } from "../controller/chatBotController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/chatbot", authMiddleware, chatbotResponse);

export default router;
