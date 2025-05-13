import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
import { Response } from 'express'

export const generateToken = (userId: string, res: Response) =>{
    if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !==" development ",
        sameSite: "strict"
    });
    return token;
}