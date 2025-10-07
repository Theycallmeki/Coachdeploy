import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const createBMI = async (req, res) => {
  try {
    const { userId, bmi } = req.body;

    if (!userId || !bmi) {
      return res.status(400).json({ error: "userId and bmi are required" });
    }

    await db.update(users).set({ bmi }).where(eq(users.id, userId));

    res.status(201).json({ message: "BMI added successfully", bmi });
  } catch (error) {
    console.error("Create BMI error:", error);
    res.status(500).json({ error: "Failed to add BMI" });
  }
};

export const updateBMI = async (req, res) => {
  try {
    const { userId, bmi } = req.body;

    if (!userId || !bmi) {
      return res.status(400).json({ error: "userId and bmi are required" });
    }

    await db.update(users).set({ bmi }).where(eq(users.id, userId));

    res.status(200).json({ message: "BMI updated successfully", bmi });
  } catch (error) {
    console.error("Update BMI error:", error);
    res.status(500).json({ error: "Failed to update BMI" });
  }
};

export const getBMI = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ userId, bmi: user.bmi });
  } catch (error) {
    console.error("Get BMI error:", error);
    res.status(500).json({ error: "Failed to fetch BMI" });
  }
};
