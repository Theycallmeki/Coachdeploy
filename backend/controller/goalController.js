import { db } from "../db/index.js";
import { goals } from "../db/schema.js";
import { eq } from "drizzle-orm";

// ✅ Get all goals for the logged-in user
export const getGoals = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ get userId from JWT
    const userGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId));
    res.json(userGoals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

// ✅ Create a new goal for logged-in user
export const createGoal = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; // ✅ get userId from JWT

    if (!name || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newGoal = await db
      .insert(goals)
      .values({ userId, name, description })
      .returning();

    res.status(201).json(newGoal[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

// ✅ Update an existing goal
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updated = await db
      .update(goals)
      .set({ name, description })
      .where(eq(goals.id, id))
      .returning();

    res.status(200).json(updated[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update goal" });
  }
};

// ✅ Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(goals).where(eq(goals.id, id));
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};
