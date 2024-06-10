import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Story from "../models/story.model.js";

export const createStory = async (req, res) => {
  try {
    const { text } = req.body;
    let { mediaType, mediaBase64 } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !mediaBase64) {
      return res.status(400).json({ error: "Story must have text or media" });
    }

    if(mediaBase64) {
      const uploadResponse = await cloudinary.uploader.upload(mediaBase64, {
        resource_type: mediaType === 'video' ? 'video' : 'image',
        folder: 'stories',
      }).catch(err =>{
        console.log(err);
      });
      mediaBase64 = uploadResponse.secure_url;
    }

    const newStory = new Story({
      user: userId,
      mediaBase64,
      text,
      mediaType,
    });

    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
    console.log("error in createStory controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getStories = async (req, res) => {
    try {
        const stories = await Story.find().populate('user', 'username profileImg');
        res.status(200).json(stories);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}
