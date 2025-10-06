import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

const app = express();
const PORT = 3001;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api", goalRoutes)

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
