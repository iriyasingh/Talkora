import express from "express";
import {
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  cancelFriendRequest,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();


router.use(protectRoute); // Apply the protectRoute middleware to all routes in this router
router.get("/", getRecommendedUsers)

router.get("/friends", getFriends)

router.post("/friend-request/:id",sendFriendRequest)

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);

router.post("/friend-request/", getFriendRequests);

router.get("/outgoing-friend-requests", getOutgoingFriendRequests);

router.post("/friend-request/:id/outgoing", getOutgoingFriendRequests);

router.post("/friend-request/:id/cancel", cancelFriendRequest);

export default router;