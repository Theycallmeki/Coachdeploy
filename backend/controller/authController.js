import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * 🧩 REGISTER CONTROLLER
 */
export const register = async (req, res) => {
  try {
    console.log("📩 Incoming register request:", req.body);

    const { name, email, password, bmi } = req.body;

    if (!name || !email || !password || !bmi) {
      console.log("⚠️ Missing required field(s)");
      return res
        .status(400)
        .json({ message: "Please input all required fields." });
    }

    if (!validator.isEmail(email)) {
      console.log("⚠️ Invalid email format:", email);
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!validator.isStrongPassword(password)) {
      console.log("⚠️ Weak password:", password);
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol.",
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existingUser.length >= 1) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password_hash: hashedPassword,
      bmi: Number(bmi),
    });

    console.log("✅ Registration successful!");
    return res
      .status(200)
      .json({ success: true, message: "Registered successfully!" });
  } catch (err) {
    console.error("❌ Register error details:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * 🧩 LOGIN CONTROLLER
 */
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
    console.error("❌ Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🧩 LOGOUT CONTROLLER
 */
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged Out" });
  } catch (err) {
    console.error("❌ Logout error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * 🧩 AUTH CHECK CONTROLLER
 */
export const authChecker = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(200).json({ loggedIn: false, user: null });

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(200).json({ loggedIn: false, user: null });

    // ✅ Fetch full user from DB to get name
    const [user] = await db.select().from(users).where(eq(users.id, decoded.id));
    if (!user) return res.status(200).json({ loggedIn: false, user: null });

    res.status(200).json({
      loggedIn: true,
      user: {
        id: user.id,
        name: user.name, // now includes name
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ Auth check error:", err);
    res.status(200).json({ loggedIn: false, user: null });
  }
};
