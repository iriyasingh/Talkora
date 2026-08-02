import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import toast from "react-hot-toast";
import "stream-chat-react/dist/css/v2/index.css";
import { useAuthStore } from "../store/useAuthStore";
import { useStreamClient } from "../hooks/useStreamClient";
import PageLoader from "../components/common/PageLoader";
import CallLauncher from "../components/chat/CallLauncher";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { authUser } = useAuthStore();
  const { client, isConnecting } = useStreamClient();
  const [channel, setChannel] = useState(null);
  const [isLoadingChannel, setIsLoadingChannel] = useState(true);

  useEffect(() => {
    if (!client || !targetUserId) return;

    let cancelled = false;

    const initChannel = async () => {
      setIsLoadingChannel(true);
      try {
        const myId = authUser._id ?? authUser.id;
        const channelId = [myId, targetUserId].sort().join("-");
        const streamChannel = client.channel("messaging", channelId, {
          members: [myId, targetUserId],
        });
        await streamChannel.watch();
        if (!cancelled) setChannel(streamChannel);
      } catch (error) {
        toast.error("Couldn't open this conversation");
      } finally {
        if (!cancelled) setIsLoadingChannel(false);
      }
    };

    initChannel();

    return () => {
      cancelled = true;
    };
  }, [client, targetUserId, authUser]);

  if (isConnecting || isLoadingChannel || !client || !channel) return <PageLoader />;

  return (
    <div className="h-full">
      <Chat client={client}>
        <Channel channel={channel}>
          <Window>
            <div className="flex items-center justify-between gap-3 border-b border-base-300 bg-base-100 px-4 py-3">
              <ChannelHeader />
              <CallLauncher
                targetUserId={targetUserId}
                targetUserName={channel?.data?.name}
                channel={channel}
              />
            </div>
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
