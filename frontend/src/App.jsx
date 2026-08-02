import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

import PageLoader from "./components/common/PageLoader";
import ProtectedRoute from "./components/common/ProtectedRoute";
import OnboardingRoute from "./components/common/OnboardingRoute";
import PublicRoute from "./components/common/PublicRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import FriendRequestsPage from "./pages/FriendRequestsPage";
import DiscoverUsersPage from "./pages/DiscoverUsersPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";
import NotFoundPage from "./pages/NotFoundPage";
import CallPage from "./pages/CallPage";
import ChatsPage from "./pages/ChatsPage";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content">
      <Routes>
        {/* Public-only routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Onboarding: requires auth, blocks if already onboarded */}
        <Route element={<OnboardingRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Protected routes: requires auth + onboarding complete */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} handle={{ title: "Home" }} />
          <Route path="/friends" element={<FriendsPage />} handle={{ title: "Friends" }} />
          <Route
            path="/friend-requests"
            element={<FriendRequestsPage />}
            handle={{ title: "Friend Requests" }}
          />
          <Route path="/discover" element={<DiscoverUsersPage />} handle={{ title: "Discover" }} />
          <Route path="/profile" element={<ProfilePage />} handle={{ title: "Profile" }} />
          <Route path="/settings" element={<SettingsPage />} handle={{ title: "Settings" }} />
          <Route path="/chat/:id" element={<ChatPage />} handle={{ title: "Chat" }} />
          <Route path="/call/:callType/:callId" element={<CallPage />}/>
          <Route path="/chats" element={<ChatsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster position="top-center" toastOptions={{ className: "text-sm" }} />
    </div>
  );
}

export default App;
