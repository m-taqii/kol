import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
import User from "../models/user.model"

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token 
    ?? req.headers.authorization?.split(" ")[1]

  if (!token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: string }

    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: "Unauthorized" })

    req.userId = decoded.id
    next()
  } catch {
    return res.status(401).json({ message: "Invalid token" })
  }
}