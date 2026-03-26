import express from "express";
import { loginUser, registerUser, getMe } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);

export default router;