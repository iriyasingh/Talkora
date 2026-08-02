import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Avatar from "./Avatar";

const FriendCard = ({ user }) => {
  const id = user._id ?? user.id;

  return (
    <div className="flex items-center gap-3 rounded-box border border-base-300 bg-base-100 p-4 transition-shadow hover:shadow-sm">
      <Avatar src={user.profilePicture} name={user.fullName} size="md" online={user.isOnline} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{user.fullName}</p>
        <p className="truncate text-sm text-base-content/50">
          {user.nativeLanguage || user.location || "Friend"}
        </p>
      </div>
      <Link to={`/chat/${id}`} className="btn btn-primary btn-sm gap-1.5">
        <MessageCircle className="size-3.5" />
        Chat
      </Link>
    </div>
  );
};

export default FriendCard;
