import express, { type Request, type Response } from "express";
import userRoutes from "./routes/user.route";
import roomRoutes from "./routes/room.route";
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/auth", userRoutes);
app.use("/room", roomRoutes);

export default app;