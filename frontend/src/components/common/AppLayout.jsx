import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";



const AppLayout = () => {
  const location = useLocation();
  const isChatRoute = location.pathname.startsWith("/chat");

  let title = "Talkora";

  if (location.pathname === "/") title = "Home";
  else if (location.pathname.startsWith("/friends")) title = "Friends";
  else if (location.pathname.startsWith("/discover")) title = "Discover";
  else if (location.pathname.startsWith("/notifications")) title = "Notifications";
  else if (location.pathname.startsWith("/settings")) title = "Settings";
  else if (location.pathname.startsWith("/profile")) title = "Profile";
  else if (location.pathname.startsWith("/chat")) title = "Chat";

  return (
    <div className="flex h-screen overflow-hidden bg-base-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={title} />
        <main className={isChatRoute ? "flex-1 overflow-hidden" : "flex-1 overflow-y-auto pb-16 lg:pb-0"}>
          <Outlet />
        </main>
      </div>
      {!isChatRoute && <MobileNav />}
    </div>
  );
};

export default AppLayout;
