import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    const uri = process.env.MONGO_URI
     if (!uri) {
        throw new Error('MONGO_URI is not defined in the environment variables');
    }
    try {
        const conn = await mongoose.connect(uri)
        console.log(`MongoDB connected`)
    } catch (error) {
        console.log("MongoDB connection error", error)
    }
}  