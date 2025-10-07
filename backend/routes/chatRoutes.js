import express from "express";
import { getChats, createChat, deleteChat } from "../controller/chatController.js";

const router = express.Router()

router.get("/chats/:userId", getChats)
router.post("/chats", createChat)
router.delete("/chats/:id", deleteChat)

export default router
