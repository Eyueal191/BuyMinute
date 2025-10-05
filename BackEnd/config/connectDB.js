import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            "mongodb+srv://eyueal191:090904Eyueal%2A%2A%2A@cluster0.uhjj1pc.mongodb.net/Db_for_e-commerce?retryWrites=true&w=majority&appName=Cluster0",
            {
                connectTimeoutMS: 50000, // Wait up to 30 seconds
                serverSelectionTimeoutMS: 50000 // Server selection timeout
            }
        );

        console.log(`✅ DB has Connected`);
    } catch (error) {
        console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
        process.exit(1); // Stop the app if DB connection fails
    }
};

export default connectDB;
