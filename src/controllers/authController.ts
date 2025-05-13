import { Request, Response } from "express"
import { User } from "../models/user";
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/generateToken";

interface SignupBody {
    fullName: string;
    email: string;
    password: string;
};

export const signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {
    const { fullName, email, password } = req.body 

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'All the fields are required' });
    }
    if(password.length < 6){
        return res.status(400).json({ message: 'Password most be at least 6 characters' });
    }

    try {
        const existingUser = await User.findOne({ email })

        if(existingUser) {
            return res.status(400).json({message: "Email already exist"})
        }  

          const hashpwd = await bcrypt.hash(password, 10);

          const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashpwd
          })

          if(newUser) {
            generateToken(newUser._id.toString(), res);
            await newUser.save();

            res.status(200).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email:newUser.email,
                profilePic: newUser.profilePic
            })
          } else {
            res.status(400).json({message: "Invalid user data"})
          }
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: 'Server error' });
    }
};

interface LoginBody {
    email: string;
    password: string;
};

export const login = async (req:Request<{}, {}, LoginBody>, res:Response) =>{
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({message: "All the fields are required"})
    }
    try {
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if(!user.password  || typeof user.password !== "string") {
            return res.status(500).json({ message: "Server error: Invalid user data" });
        }  
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid email or password"})
        }

        generateToken(user._id.toString(), res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout = async (req:Request, res:Response) =>{
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ message: 'Server error' });
    }
};