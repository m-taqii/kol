import type { Request, Response } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, username } = req.body;
        const user = await User.create({ name, email, password, username });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json({ message: "User created successfully", user, token });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        const user = await User.findOne({ email, username }).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ message: "User logged in successfully", user, token });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};