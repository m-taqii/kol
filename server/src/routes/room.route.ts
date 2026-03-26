import { authMiddleware } from "../middlewares/auth.middleware";
import { 
    createRoom, 
    getRooms, 
    getRoom, 
    getMessages, 
    generateInvite, 
    joinViaInvite, 
    leaveRoom, 
    deleteRoom,
    addAiToRoom,
    removeMember
} from "../controllers/room.controller";
import express from "express";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.get("/list", authMiddleware, getRooms);
router.get("/:roomId", authMiddleware, getRoom);
router.get("/:roomId/messages", authMiddleware, getMessages);

router.post("/:roomId/invite", authMiddleware, generateInvite);
router.get("/invite/:code", authMiddleware, joinViaInvite);
router.post("/:roomId/leave", authMiddleware, leaveRoom);
router.delete("/:roomId", authMiddleware, deleteRoom);
router.delete("/:roomId/member/:userId", authMiddleware, removeMember);
router.post("/:roomId/ai/add", authMiddleware, addAiToRoom);

export default router;