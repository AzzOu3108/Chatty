import dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Request, Response, NextFunction } from "express";


export const protectRoute = async (req: Request, res:Response, next: NextFunction) =>{
    try {
        const token = req.cookies.jwt
        if(!token){
            res.status(401).json({message: "Unauthorized - No Token Provided"})
        }

        const secret = process.env.JWT_SECRET
        if(!secret){
             return res.status(500).json({ message: "JWT secret not set in environment variables" });
        }

        const decoded = jwt.verify(token, secret);

        if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const userId = (decoded as jwt.JwtPayload).userId;
        const user = await User.findById(userId).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        (req as any).user = user

        next()
    } catch (error) {
        console.log("Error in protecteRoute middleware :", error)
        res.status(500).json({message: "Server error"})
    }
}