import { authMiddleware } from "../middlewares/auth.middleware";
import { createRoom, getRooms, getRoom, getMessages } from "../controllers/room.controller";
import express from "express";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.get("/list", authMiddleware, getRooms);
router.get("/:roomId", authMiddleware, getRoom);
router.get("/:roomId/messages", authMiddleware, getMessages);

export default router;