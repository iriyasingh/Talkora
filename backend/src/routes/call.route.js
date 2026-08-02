import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createCall, getCallToken } from '../controllers/call.controller.js';

const router = express.Router();

router.get('/token', protectRoute, getCallToken);
router.post('/start', protectRoute, createCall);

export default router;