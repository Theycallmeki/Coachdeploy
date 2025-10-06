import express from "express";
import { updateBMI } from "../controller/bmiController.js";

const router = express.Router();

// PATCH /bmi/:id
router.patch("/bmi/:id", updateBMI);

export default router;
