import "dotenv/config";
import app from "./src/app";
import http from 'http';
import { initializeSocket } from "./socket";
import { connectDB } from "./src/lib/db";

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

// Initialize socket
const ioPromise = initializeSocket(server);

server.listen(PORT, async () => {
    try {
        await connectDB();
        await ioPromise;
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Initialization error:", error);
    }
});