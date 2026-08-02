import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useStreamClient } from "../hooks/useStreamClient";
import PageLoader from "../components/common/PageLoader";
import toast from "react-hot-toast";

const ChatsPage = () => {
  const navigate = useNavigate();

  const { authUser } = useAuthStore();
  const { client, isConnecting } = useStreamClient();

  const [channels, setChannels] = useState([]);

  useEffect(() => {
    if (!client || !authUser) return;

    const loadChats = async () => {
      try {
        const filters = {
          type: "messaging",
          members: {
            $in: [authUser._id ?? authUser.id],
          },
        };

        const sort = {
          last_message_at: -1,
        };

        const channels = await client.queryChannels(filters, sort);

        setChannels(channels);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't load chats");
      }
    };

    loadChats();
  }, [client, authUser]);

  if (isConnecting) return <PageLoader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chats</h1>

      {channels.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No conversations yet.
        </div>
      ) : (
        <div className="space-y-2">
          {channels.map((channel) => {
            const otherMember = Object.values(channel.state.members).find(
              (member) =>
                member.user?.id !== (authUser._id ?? authUser.id)
            );

            const lastMessage =
              channel.state.messages[channel.state.messages.length - 1];

            return (
              <div
                key={channel.id}
                onClick={() => {
                  if (otherMember?.user?.id) {
                    navigate(`/chat/${otherMember.user.id}`);
                  }
                }}
                className="flex items-center gap-4 rounded-lg border p-4 hover:bg-base-200 cursor-pointer transition"
              >
                <div className="relative">
                    <img
                        src={
                        otherMember?.user?.image ||
                        "https://placehold.co/100x100"
                        }
                        alt={otherMember?.user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />

                    {channel.countUnread() > 0 && (
                        <span className="absolute right-0 top-0 h-3 w-3 rounded-full bg-error border-2 border-base-100"></span>
                    )}
                </div>

                <div className="flex-1 overflow-hidden">
                    <h2
                    className={`font-semibold ${
                        channel.countUnread() > 0 ? "text-base-content" : "text-base-content/70"
                    }`}
                    >
                    {otherMember?.user?.name || "Unknown User"}
                    </h2>

                    <p
                    className={`text-sm truncate ${
                        channel.countUnread() > 0
                        ? "font-medium text-base-content"
                        : "text-gray-500"
                    }`}
                    >
                    {lastMessage?.text || "No messages yet"}
                    </p>
                </div>

                <div className="text-xs text-gray-400">
                  {lastMessage?.created_at
                    ? new Date(lastMessage.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatsPage;
