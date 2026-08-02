import { Loader2, Check } from "lucide-react";
import Avatar from "./Avatar";

const RequestCard = ({ request, isPending, onAccept }) => {
  const sender = request.sender ?? request.user ?? request;
  const id = request._id ?? request.id ?? sender?._id;

  return (
    <div className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-4 transition-shadow hover:shadow-sm">
      <Avatar src={sender.profilePicture} name={sender.fullName} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{sender.fullName}</p>
        <p className="truncate text-sm text-base-content/50">Wants to connect with you</p>
      </div>
      <button
        onClick={() => onAccept(id)}
        disabled={isPending}
        className="btn btn-primary btn-sm gap-1.5"
      >
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
        Accept
      </button>
    </div>
  );
};

export default RequestCard;
