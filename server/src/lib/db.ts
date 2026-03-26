import mongoose from "mongoose";

export const connectDB = async () => {
    const MONGO_URI = process.env.MONGODB_URI;

    if (!MONGO_URI) {
        throw new Error("Please provide a valid MONGODB_URI in the environment variables");
    }

    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB is already connected");
        return;
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};