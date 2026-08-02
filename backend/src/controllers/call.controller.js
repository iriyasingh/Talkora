import { randomUUID } from "crypto";
import { generateStreamToken } from "../lib/stream.js";
import { getVideoClient } from "../lib/video.js";

const CALL_TYPE_BY_MODE = {
  voice: "audio_room",
  video: "default",
};

export async function createCall(req, res) {
  try {
    const { targetUserId, mode } = req.body;
    const callerId = req.user?._id?.toString();

    if (!callerId || !targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a target user",
      });
    }

    const callMode = mode === "voice" ? "voice" : "video";
    const callType = CALL_TYPE_BY_MODE[callMode];
    const callId = randomUUID();

    // Get Stream Video client
    const videoClient = getVideoClient();

    // Create call instance
    const call = videoClient.video.call(callType, callId);

    // Create the call on Stream
    await call.create({
      ring: true,
      video: callMode === "video",
      data: {
        created_by_id: callerId,
        members: [
          { user_id: callerId },
          { user_id: targetUserId },
        ],
        custom: {
          mode: callMode,
          targetUserId,
        },
      },
    });

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    return res.status(201).json({
      success: true,
      callId,
      callType,
      mode: callMode,
      joinUrl: `${frontendUrl}/call/${callType}/${callId}`,
    });
  } catch (error) {
    console.error("========== CALL ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getCallToken(req, res) {
  try {
    const token = generateStreamToken(req.user._id.toString());

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("========== TOKEN ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}