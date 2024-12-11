import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext/useAuth";
const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
