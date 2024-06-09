import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { createRooms, joinRooms } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/create', protectRoute, createRooms)
router.post('/joined', protectRoute, joinRooms)

export default router