import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// ✅ Get BMI for logged-in user
export const getBMI = async (req, res) => {
  try {
    const userId = req.user.id; // get userId from JWT
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ bmi: user.bmi });
  } catch (error) {
    console.error("Get BMI error:", error);
    res.status(500).json({ error: "Failed to fetch BMI" });
  }
};

// ✅ Update BMI for logged-in user
export const updateBMI = async (req, res) => {
  try {
    const userId = req.user.id; // get userId from JWT
    const { bmi } = req.body;

    if (bmi === undefined) {
      return res.status(400).json({ error: "BMI is required" });
    }

    const [updated] = await db
      .update(users)
      .set({ bmi })
      .where(eq(users.id, userId))
      .returning();

    res.status(200).json({ bmi: updated.bmi });
  } catch (error) {
    console.error("Update BMI error:", error);
    res.status(500).json({ error: "Failed to update BMI" });
  }
};
