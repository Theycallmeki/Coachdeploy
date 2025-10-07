import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    next(); 
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};