import { Home, Users, UserPlus, Compass, User, Settings } from "lucide-react";
import { MessageCircle } from "lucide-react";


export const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/friends", label: "Friends", icon: Users },
  { to: "/friend-requests", label: "Requests", icon: UserPlus },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/chats", label: "Chats", icon: MessageCircle },

];
