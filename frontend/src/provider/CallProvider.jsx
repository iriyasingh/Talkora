import { useEffect, useState } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useAuthStore } from "../store/useAuthStore";
import { getCallToken } from "../api/calls";

const apiKey = import.meta.env.VITE_STREAM_API_KEY;

export default function CallProvider({ children }) {
  const { authUser } = useAuthStore();
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!authUser || !apiKey) return;

    const client = StreamVideoClient.getOrCreateInstance({
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

    setClient(client);

    return () => {
      // Don't disconnect in development.
      // React StrictMode mounts twice.
    };
  }, [authUser]);

  if (!client) return null;

  return (
    <StreamVideo client={client}>
      {children}
    </StreamVideo>
  );
}