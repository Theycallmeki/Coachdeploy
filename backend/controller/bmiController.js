import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const updateBMI = async (req, res) => {
  try {
    const { id } = req.params;
    const { bmi } = req.body;

    if (!bmi) {
      return res.status(400).json({ error: "BMI value is required" });
    }

    await db.update(users).set({ bmi }).where(eq(users.id, id));

    res.json({ message: "BMI updated successfully", bmi });
  } catch (err) {
    console.error("BMI update error:", err);
    res.status(500).json({ error: "Failed to update BMI" });
  }
};
