import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createStory, getStories } from '../controllers/story.controller.js';

const router = express.Router();

router.post('/', protectRoute, createStory)
router.get('/all', protectRoute, getStories)

export default router;