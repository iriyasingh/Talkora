import { Loader2, UserPlus, Clock } from "lucide-react";
import Avatar from "./Avatar";

const UserCard = ({ user, isRequestSent, isPending, onSendRequest, onCancelRequest }) => {
  const id = user._id ?? user.id;

  return (
    <div className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-4 transition-shadow hover:shadow-sm">
      <Avatar src={user.profilePicture} name={user.fullName} size="md" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{user.fullName}</p>
        <p className="truncate text-sm text-base-content/50">
          {user.nativeLanguage || user.location || user.bio || "New on Talkora"}
        </p>
      </div>

      {isRequestSent ? (
        <button
          onClick={() => onCancelRequest(id)}
          disabled={isPending}
          className="btn btn-outline btn-sm gap-1.5"
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Clock className="size-3.5" />}
          Pending
        </button>
      ) : (
        <button
          onClick={() => onSendRequest(id)}
          disabled={isPending}
          className="btn btn-outline btn-primary btn-sm gap-1.5"
        >
          {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <UserPlus className="size-3.5" />}
          Add
        </button>
      )}
    </div>
  );
};

export default UserCard;
