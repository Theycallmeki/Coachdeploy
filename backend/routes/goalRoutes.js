import express from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controller/goalController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/goals/:userId", authMiddleware, getGoals);
router.post("/goals/", authMiddleware, createGoal);
router.patch("/goals/:id", authMiddleware, updateGoal);
router.delete("/goals/:id", authMiddleware, deleteGoal);

export default router;
