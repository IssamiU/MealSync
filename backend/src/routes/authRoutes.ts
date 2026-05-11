import { Router } from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // RF29
router.post("/reset-password", resetPassword);   // RF29

export default router;