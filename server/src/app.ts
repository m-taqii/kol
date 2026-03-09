import express, { type Request, type Response } from "express";
import userRoutes from "./routes/user.route";
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.post("/auth/register", userRoutes);

app.post("/auth/login", userRoutes);

export default app;