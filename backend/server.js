import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// register routes
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
