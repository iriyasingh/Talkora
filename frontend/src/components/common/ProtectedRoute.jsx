import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import PageLoader from "./PageLoader";
import AppLayout from "./AppLayout";

const ProtectedRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <PageLoader />;

  if (!authUser) return <Navigate to="/login" replace />;

  if (!authUser.isOnboarded) return <Navigate to="/onboarding" replace />;

  return <AppLayout />;
};

export default ProtectedRoute;
