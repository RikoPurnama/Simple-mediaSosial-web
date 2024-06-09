import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  commentPost,
  createPost,
  deletePost,
  getAllPost,
  getLikedPosts,
  likeUnlikePost,
  getFollowingPosts,
  getUserPosts,
  getSavedPosts,
  savePost,
  getPost,
  getRoomPosts,
  createRoomPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPost);
router.get("/rooms/:id/posts", protectRoute, getRoomPosts);
router.get("/:id", protectRoute, getPost);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/saved/:id", protectRoute, getSavedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/rooms/:id/posts", protectRoute, createRoomPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/save/:id", protectRoute, savePost);
router.post("/comment/:id", protectRoute, commentPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
