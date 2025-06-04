import { Request } from "express";

export interface AuthRequest extends Request {
  user?: any; 
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