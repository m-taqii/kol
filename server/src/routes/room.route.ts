import { authMiddleware } from "../middlewares/auth.middleware";
import { createRoom } from "../controllers/room.controller";
import express from "express";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);

export default router;