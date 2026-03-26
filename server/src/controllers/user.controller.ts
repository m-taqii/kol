import type { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { connectDB } from "../lib/db";

function getJWTSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET environment variable is required");
    return secret;
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, username } = req.body;

        // Input validation
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        if (!/^[a-z0-9_]{3,20}$/.test(username)) {
            return res.status(400).json({ message: "Username must be 3-20 characters, lowercase letters, numbers and underscores only" });
        }

        await connectDB();
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ name, email, password, username });
        const token = jwt.sign({ id: user._id }, getJWTSecret(), {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/"
        });
        res.status(201).json({ message: "User created successfully", username: user.username, token });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        await connectDB();
        const user = await User.findOne({
            $or: [{ email }, { username: email }]
        }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "Invalid Email or Password" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }
        const token = jwt.sign({ id: user._id }, getJWTSecret(), {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: "/"
        });
        res.status(200).json({ message: "User logged in successfully", username: user.username, token });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        await connectDB();
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};