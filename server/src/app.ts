import express, { type Request, type Response } from "express";
import userRoutes from "./routes/user.route";
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/auth", userRoutes);

export default app;