import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";

// GET /friends/list
export async function listFriends(req: AuthRequest, res: Response) {
    try {
        const user = await User.findById(req.userId)
            .populate("friends", "name username online")
            .populate("friendRequests", "name username online")
            .select("friends friendRequests");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({
            friends: user.friends,
            friendRequests: user.friendRequests,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to list friends" });
    }
}

// GET /friends/search?q=...
export async function searchUsers(req: AuthRequest, res: Response) {
    try {
        const q = (req.query.q as string || "").trim();
        if (!q) return res.status(400).json({ error: "Missing query" });

        const regex = new RegExp(q, "i");
        const users = await User.find({
            $or: [{ name: regex }, { username: regex }],
            _id: { $ne: req.userId },
        }).select("name username online").limit(10);

        // Get current user's friends + sent requests to annotate results
        const me = await User.findById(req.userId).select("friends");
        const myFriends = (me?.friends || []).map((id: any) => id.toString());

        // Get users who have a pending request from me (my ID is in their friendRequests)
        const sentTo = await User.find({
            friendRequests: req.userId,
            _id: { $in: users.map(u => u._id) }
        }).select("_id");
        const sentToIds = sentTo.map((u: any) => u._id.toString());

        const annotated = users.map(u => ({
            _id: u._id,
            name: u.name,
            username: u.username,
            online: u.online,
            isFriend: myFriends.includes(u._id.toString()),
            requestSent: sentToIds.includes(u._id.toString()),
        }));

        res.status(200).json(annotated);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to search users" });
    }
}

// POST /friends/request
// Body: { username: string }
export async function sendFriendRequest(req: AuthRequest, res: Response) {
    try {
        const { username } = req.body as { username: string };
        if (!username) return res.status(400).json({ error: "Missing username" });

        const target = await User.findOne({ username });
        if (!target) return res.status(404).json({ error: "User not found" });

        if (target._id.toString() === req.userId)
            return res.status(400).json({ error: "Cannot send request to yourself" });

        // Already friends?
        const me = await User.findById(req.userId);
        if (me?.friends.map((f: any) => f.toString()).includes(target._id.toString()))
            return res.status(400).json({ error: "Already friends" });

        // Already sent?
        if (target.friendRequests.map((f: any) => f.toString()).includes(req.userId!))
            return res.status(400).json({ error: "Request already sent" });

        await User.findByIdAndUpdate(target._id, {
            $addToSet: { friendRequests: req.userId }
        });

        res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to send friend request" });
    }
}

// POST /friends/respond
// Body: { fromUserId: string, action: "accept" | "decline" }
export async function respondToRequest(req: AuthRequest, res: Response) {
    try {
        const { fromUserId, action } = req.body as { fromUserId: string; action: "accept" | "decline" };
        if (!fromUserId || !action) return res.status(400).json({ error: "Missing fields" });

        // Remove from my friendRequests either way
        await User.findByIdAndUpdate(req.userId, {
            $pull: { friendRequests: fromUserId }
        });

        if (action === "accept") {
            await User.findByIdAndUpdate(req.userId, {
                $addToSet: { friends: fromUserId }
            });
            await User.findByIdAndUpdate(fromUserId, {
                $addToSet: { friends: req.userId }
            });
        }

        res.status(200).json({ success: true, action });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to respond to request" });
    }
}
