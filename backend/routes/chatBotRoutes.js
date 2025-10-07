import express from "express";
import { chatbotResponse } from "../controller/chatBotController.js";


const router = express.Router();

router.post("/chatbot", chatbotResponse);

export default router;
