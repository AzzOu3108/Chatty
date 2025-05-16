import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { User } from "../models/user";
import {AuthRequest} from "../types/AuthRequest"

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id;

    if(!profilePic){
        return res.status(400).json({message: "Profile picture is required"})
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updateUser = await User.findByIdAndUpdate(
        userId,
        {profilePic: uploadResponse.secure_url},
        {new: true}
    )

    res.status(200).json(updateProfile)
    
  } catch (error) {
    console.log("Error in update profile:", error )
    res.status(500).json({message: "Server error"})
  }
};

export const checkAuth= async (req: AuthRequest, res: Response) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error)
        res.status(500).json({message: "Server error"})
    }
}