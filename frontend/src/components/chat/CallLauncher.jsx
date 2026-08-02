import { useState } from "react";
import { createPortal } from "react-dom";
import { Phone, Video, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { EmbeddedCall } from "@stream-io/video-react-sdk/embedded";
import "@stream-io/video-react-sdk/dist/css/embedded.css";
import { useAuthStore } from "../../store/useAuthStore";
import { createCallSession, getCallToken } from "../../api/calls";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallLauncher = ({
        targetUserId,
        targetUserName,
        channel,
      }) => {
  const { authUser } = useAuthStore();
  const [isStarting, setIsStarting] = useState(false);
  const [activeCall, setActiveCall] = useState(null);

  const startCall = async (mode) => {
    if (!targetUserId || !authUser) return;

    setIsStarting(true);
    try {
      const data = await createCallSession({
        targetUserId,
        mode,
      });

      // Send the link in chat
      await channel.sendMessage({
        text:
          `${mode === "video" ? "📹" : "📞"} Join the call:\n${data.joinUrl}`,
      });

      // Open the call for the caller
      window.open(data.joinUrl, "_blank");

      
    } catch (error) {
      toast.error(error?.response?.data?.message || "Couldn't start call");
    } finally {
      setIsStarting(false);
    }
  };

  if (!STREAM_API_KEY) return null;

  const tokenProvider = async () => {
    const data = await getCallToken();
    return data.token;
  };

  const closeCall = () => setActiveCall(null);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => startCall("voice")}
          disabled={isStarting}
          className="btn btn-ghost btn-sm gap-2"
          title={`Start voice call with ${targetUserName || 'this user'}`}
        >
          {isStarting ? <Loader2 className="size-4 animate-spin" /> : <Phone className="size-4" />}
          Voice
        </button>
        <button
          type="button"
          onClick={() => startCall("video")}
          disabled={isStarting}
          className="btn btn-primary btn-sm gap-2"
          title={`Start video call with ${targetUserName || 'this user'}`}
        >
          {isStarting ? <Loader2 className="size-4 animate-spin" /> : <Video className="size-4" />}
          Video
        </button>
      </div>

      {activeCall && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-50 bg-base-100">
              <div className="absolute right-4 top-4 z-10">
                <button
                  type="button"
                  onClick={closeCall}
                  className="btn btn-ghost btn-circle"
                  aria-label="Close call"
                >
                  <X className="size-5" />
                </button>
              </div>
              <EmbeddedCall
                apiKey={STREAM_API_KEY}
                user={{
                  type: "authenticated",
                  id: authUser._id ?? authUser.id,
                  name: authUser.fullName,
                  image: authUser.profilePicture,
                }}
                callId={activeCall.callId}
                callType={activeCall.callType}
                tokenProvider={tokenProvider}
                onError={(error) => {
                console.error("EmbeddedCall error:", error);
                console.error("Error details:", JSON.stringify(error, null, 2));
                toast.error("Call failed to load");
                }}
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default CallLauncher;