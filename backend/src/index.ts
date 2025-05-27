import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./routes/authRouter";
import messagesRouter from "./routes/messagesRouter"
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); 
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRouter);
app.use("/api/messages", messagesRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});