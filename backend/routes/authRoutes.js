import express from "express";
import cookieParser from "cookie-parser";
import {
  register,
  login,
  logout,
  authChecker,
} from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(cookieParser());

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/check", authChecker);

export default router;
