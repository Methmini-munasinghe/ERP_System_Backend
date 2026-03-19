import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import * as authController from "../controller/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/logout", authController.logout);
router.get("/users", protect, authController.getUsers);

router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.put("/reset-password", authController.resetPassword);

export default router;