import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext/useAuth";
import { LinearProgress } from "@mui/material";
import { DisabledBackground } from "../styles/customComponents";

const SuperAdminRoute = () => {
  const { isSuperAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <LinearProgress sx={{ zIndex: 2 }} />
        <DisabledBackground />
      </>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default SuperAdminRoute;
