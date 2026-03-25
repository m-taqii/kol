import Room from "../models/room.model";
import mongoose from "mongoose";
import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";

async function createRoom(req: AuthRequest, res: Response) {
    try {
        const { name, members, aiMembers }: { name: string; members: string[]; aiMembers: string[] } = req.body;
        const ownerId = req.userId;

        if (!ownerId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const owner = new mongoose.Types.ObjectId(ownerId);

        const users = await User.find({ username: { $in: members } });
        const memberIds = users.map(u => u._id as mongoose.Types.ObjectId);

        const room = await Room.create({ 
            name: name.trim(), 
            members: [...memberIds, owner], 
            aiMembers, 
            owner 
        });
        
        res.status(201).json(room);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create room" });
    }
}

export { createRoom };