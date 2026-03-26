import { authMiddleware } from "../middlewares/auth.middleware";
import {
    listFriends,
    searchUsers,
    sendFriendRequest,
    respondToRequest,
} from "../controllers/friend.controller";
import express from "express";

const router = express.Router();

router.get("/list", authMiddleware, listFriends);
router.get("/search", authMiddleware, searchUsers);
router.post("/request", authMiddleware, sendFriendRequest);
router.post("/respond", authMiddleware, respondToRequest);

export default router;
