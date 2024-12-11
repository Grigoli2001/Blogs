import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
