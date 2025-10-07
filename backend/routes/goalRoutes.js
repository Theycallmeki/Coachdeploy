import express from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controller/goalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Use authMiddleware to get user from token, no need for :userId
router.get("/goals", authMiddleware, getGoals); // removed :userId
router.post("/goals", authMiddleware, createGoal);
router.patch("/goals/:id", authMiddleware, updateGoal);
router.delete("/goals/:id", authMiddleware, deleteGoal);

export default router;
