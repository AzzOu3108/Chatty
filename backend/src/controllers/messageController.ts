import { User } from "../models/user";
import { Message } from "../models/messages";
import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";
import cloudinary from "../config/cloudinary";

export const getUserForSidebar = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInUserId = req.user._id;
    const filterdUsers = await User.find(
      { _id: { $ne: loggedInUserId } }
    ).select("_id fullName profilePic");

    res.status(200).json(filterdUsers);
  } catch (error) {
    console.log("Error in getUserForSidebar :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller :", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //TODO: realtime functionality goes here =>socket.io

    res.status(200).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessages controller :", error);
    res.status(500).json({ message: "Server error" });
  }
};