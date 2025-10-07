import express from "express";
import {
  createBMI,
  getBMI,
  updateBMI,
} from "../controller/bmiController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.patch("/bmi", authMiddleware, updateBMI);
router.post("/bmi", authMiddleware, createBMI);
router.get("/bmi/:userId", authMiddleware, getBMI);

export default router;
