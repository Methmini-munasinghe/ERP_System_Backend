import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import * as authController from "../controller/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/authValidator.js";
import {
  forgotPassword,
  resetPassword
} from "../controller/authController.js";

router.post("/register", validateRegister, authController.register);

router.post("/login", validateLogin, authController.login);

router.post("/logout", authController.logout);

router.get("/users", protect, authController.getUsers);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);


export default router;
