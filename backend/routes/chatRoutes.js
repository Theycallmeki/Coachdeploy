import express from "express";
import { getChats, createChat, deleteChat } from "../controller/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/chats", authMiddleware, getChats); // leko ke ing :userId
router.post("/chats", authMiddleware, createChat)
router.delete("/chats/:id", authMiddleware, deleteChat)

export default router
