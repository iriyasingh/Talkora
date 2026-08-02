import { NavLink } from "react-router-dom";
import { MessageCircle, LogOut } from "lucide-react";
import { NAV_ITEMS } from "../../constants/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import Avatar from "../common/Avatar";
import { useEffect, useState } from "react";
import { useStreamClient } from "../../hooks/useStreamClient";


const Sidebar = () => {
    const { authUser, logout, isLoggingOut } = useAuthStore();

    const { client } = useStreamClient();

    const [unreadCount, setUnreadCount] = useState(0);


    useEffect(() => {
      if (!client) return;

      const updateUnreadCount = () => {
        setUnreadCount(client.user?.total_unread_count || 0);
      };

      updateUnreadCount();

      const listener = client.on((event) => {
        if (
          event.type === "message.new" ||
          event.type === "message.read" ||
          event.type === "notification.mark_read"
        ) {
          updateUnreadCount();
        }
      });

      return () => {
        listener.unsubscribe();
      };
    }, [client]);

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-base-300 bg-base-100 lg:flex">

      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex size-9 items-center justify-center rounded-field bg-primary text-primary-content">
          <MessageCircle className="size-5" />
        </div>
        <span className="text-lg font-semibold">
          Talkora
        </span>
      </div>


      <nav className="flex flex-1 flex-col gap-1 px-3">

        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/home"}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-field px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Icon className="size-4.5" />

                {label === "Chats" && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 h-2.5 w-2.5 rounded-full bg-error"></span>
                )}
              </div>

              {label}
            </div>
          </NavLink>
        ))}

        

      </nav>


      <div className="border-t border-base-300 p-3">
        ...
      </div>

    </aside>
  );
};

export default Sidebar;