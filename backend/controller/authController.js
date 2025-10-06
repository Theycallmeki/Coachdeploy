import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 🟩 REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Please input all fields." });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character",
      });

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length >= 1)
      return res.status(400).json({ message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password_hash: hashedPassword,
    });

    res.status(200).json({ success: true, message: "Registered!" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Please input all fields." });

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
};

export const authChecker = (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(200).json({ loggedIn: false, user: null });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(200).json({ loggedIn: false, user: null });

    res.status(200).json({
      loggedIn: true,
      user: { id: decoded.id, email: decoded.email },
    });
  } catch (err) {
    res.status(200).json({ loggedIn: false, user: null });
  }
};
