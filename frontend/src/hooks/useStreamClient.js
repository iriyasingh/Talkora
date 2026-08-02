import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getStreamToken } from "../api/chat";
import { useAuthStore } from "../store/useAuthStore";
import { getStreamClient } from "../lib/streamClient";

export const useStreamClient = () => {
  const { authUser } = useAuthStore();
  const [client, setClient] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    let cancelled = false;
    const chatClient = getStreamClient();

    const connect = async () => {
      setIsConnecting(true);
      try {
        if (chatClient.userID) {
          if (!cancelled) setClient(chatClient);
          return;
        }
        const { token } = await getStreamToken();
        await chatClient.connectUser(
          {
            id: authUser._id ?? authUser.id,
            name: authUser.fullName,
            image: authUser.profilePicture,
          },
          token
        );
        if (!cancelled) setClient(chatClient);
      } catch (error) {
        toast.error("Couldn't connect to chat");
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    };

    connect();

    return () => {
      cancelled = true;
    };
  }, [authUser]);

  return { client, isConnecting };
};
