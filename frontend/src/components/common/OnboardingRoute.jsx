import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import PageLoader from "./PageLoader";

const OnboardingRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <PageLoader />;

  if (!authUser) return <Navigate to="/login" replace />;

  if (authUser.isOnboarded) return <Navigate to="/home" replace />;

  return <Outlet />;
};

export default OnboardingRoute;
