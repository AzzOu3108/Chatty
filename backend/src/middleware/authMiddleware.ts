import dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest"; // Ensure this type exists

export const protectRoute = async (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  try {
    let token: string | undefined;
    
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } 

    else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    
    if (!decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token Structure" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware:", error.message);
    
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    
    res.status(500).json({ message: "Authentication server error" });
  }
};