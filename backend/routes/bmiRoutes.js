import express from "express";
import {
  createBMI,
  getBMI,
  updateBMI,
} from "../controller/bmiController.js";

const router = express.Router();

router.patch("/bmi", updateBMI);
router.post("/bmi", createBMI);
router.get("/bmi/:userId", getBMI);

export default router;
