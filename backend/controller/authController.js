import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const getUsers = async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    await db.insert(users).values({ name, email });
    res.json({ message: "User added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to insert user" });
  }
};

export const deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await db.delete(users).where(eq(users.id, id));
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
