import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/authRouter";
import { connectDB } from "./config/db";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // Ensure this is applied before the routes

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});