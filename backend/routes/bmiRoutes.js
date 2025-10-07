import express from "express";
import { getBMI, updateBMI } from "../controller/bmiController.js"; // removed createBMI
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get BMI for the logged-in user
router.get("/bmi", authMiddleware, getBMI);

// Update BMI for the logged-in user
router.patch("/bmi", authMiddleware, updateBMI);

export default router;
