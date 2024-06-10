import { v2 as cloudinary } from "cloudinary";

import Post from "../../models/post.model.js";
import User from "../../models/user.model.js";
import Notification from "../../models/notification.model.js";
import Room from "../../models/room.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { mediaUrl } = req.body;
    const { mediaType } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !mediaUrl) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (mediaUrl) {
      const uploadedResponse = await cloudinary.uploader
        .upload(mediaUrl, {
          folder: "posts",
          resource_type: mediaType === "video" ? "video" : "image",
        })
        .catch((err) => {
          console.log(err);
        });
      mediaUrl = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      mediaUrl,
      mediaType,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

export const createRoomPost = async (req, res) => {
  try {
    const { text, roomId } = req.body;
    let { mediaUrl } = req.body;
    const { mediaType } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.students.includes(userId)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this class" });
    }

    if (!text && !mediaUrl) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    if (mediaUrl) {
      const uploadedResponse = await cloudinary.uploader
        .upload(mediaUrl, {
          folder: "posts",
          resource_type: mediaType === "video" ? "video" : "image",
        })
        .catch((err) => {
          console.log(err);
        });
      mediaUrl = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      mediaUrl,
      mediaType,
      classroom: roomId,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.mediaUrl) {
      const imageUrl = post.mediaUrl;
      const parts = imageUrl.split("/");
      const publicIdWithExtension = parts[parts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];
      await cloudinary.api.delete_resources(["posts/"+publicId], {
        type: "upload",
        resource_type: post.mediaType,
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("error in post delete controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field id required" });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("error in post comments controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // unliked post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      // like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("error in post likeUnlike controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const savePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userSavedPost = post.saved.includes(userId);

    if (userSavedPost) {
      // unsave post
      await Post.updateOne({ _id: postId }, { $pull: { saved: userId } });
      await User.updateOne({ _id: userId }, { $pull: { savedPosts: postId } });

      const updateSaved = post.saved.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updateSaved);
    } else {
      // save post
      post.saved.push(userId);
      await User.updateOne({ _id: userId }, { $push: { savedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "save",
      });
      await notification.save();

      const updateSaved = post.saved;
      res.status(200).json(updateSaved);
    }
  } catch (error) {
    console.log("error in post getSavedPOst controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("error in post getAllPost controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (!post) return res.status(404).json("Post not found");

    res.status(200).json(post);
  } catch (error) {
    console.log("error in post getPost controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("error in post getLikedPost controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSavedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const savedPosts = await Post.find({ _id: { $in: user.savedPosts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(savedPosts);
  } catch (error) {
    console.log("error in post getSavedPost controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("error in post getFollowingPost controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(posts);
  } catch (error) {
    console.log("error in post getUserPost controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRoomPosts = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id; // Asumsi user ID tersedia di req.user

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Kelas tidak ditemukan" });
    }

    if (!room.students.includes(userId)) {
      return res.status(403).json({ message: "Anda bukan anggota kelas ini" });
    }

    const posts = await Post.find({ classroom: roomId }).populate(
      "user",
      "username"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Kesalahan server", error });
  }
};
