import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import PageLoader from "./PageLoader";

const PublicRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <PageLoader />;

  if (authUser) {
    return <Navigate to={authUser.isOnboarded ? "/home" : "/onboarding"} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
