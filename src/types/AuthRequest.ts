import { Request } from "express";

export interface AuthRequest extends Request {
  user?: any; // Replace 'any' with your User type if you have one
}

export interface SignupBody {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
}