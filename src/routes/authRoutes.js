import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import * as authController from "../controller/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/authValidator.js";

router.post("/register", validateRegister, authController.register);

router.post("/login", validateLogin, authController.login);

router.post("/logout", authController.logout);

router.get("/users", protect, authController.getUsers);

export default router;
