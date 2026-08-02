import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  Call,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { useAuthStore } from "../store/useAuthStore";
import { getCallToken } from "../api/calls";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export default function CallPage() {
  const { callId, callType } = useParams();
  const { authUser } = useAuthStore();

  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    if (!authUser) return;

    let videoClient;

    const init = async () => {
      videoClient = new StreamVideoClient({
        apiKey,
        user: {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePicture,
        },
        tokenProvider: async () => {
          const res = await getCallToken();
          return res.token;
        },
      });

      const streamCall = videoClient.call(callType, callId);

      await streamCall.join({ create: false });

      setClient(videoClient);
      setCall(streamCall);
    };

    init();

    return () => {
      call?.leave();
      videoClient?.disconnectUser?.();
    };
  }, [authUser, callId, callType]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center">
        Joining call...
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme>
          <SpeakerLayout />
          <CallControls />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}