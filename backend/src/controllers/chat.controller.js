import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user._id);

        res.status(200).json({success:true, token});

    } catch (error) {
        console.error("Error generating Stream token:", error);
        res.status(500).json({success:false, message: "Internal server error"});
    }
}