import express from "express";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controller/goalController.js";

const router = express.Router();

router.get("/goals/:userId", getGoals);
router.post("/goals/", createGoal);
router.patch("/goals/:id", updateGoal);
router.delete("/goals/:id", deleteGoal);

export default router;
