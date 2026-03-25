import "dotenv/config";
import app from "./src/app";
import { Server } from "socket.io";
import http from 'http';

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})


io.on("connection", (socket) => {
    console.log("a user connected");
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});