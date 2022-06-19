import React from "react";
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/authentication";
import { useQueryMe } from "../graphql/quries/me";
import NavBar from "../components/NavBar";
import Navigation from "../components/Navigation";
import { UserRole } from "../utils/type";

interface Props {
  roles?: string[];
  children: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ children, roles }) => {
  const { data: user, loading } = useQueryMe();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (!user?.role || !roles || roles.indexOf(user?.role) < 0) {
    if (user?.role === UserRole.Manager) {
      return <Navigate to="/users" />;
    } else if (user?.role === UserRole.User) {
      return <Navigate to="/bikes" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return (
    <>
      <NavBar />
      <Box sx={{ display: "flex" }}>
        <Navigation />
        {children}
      </Box>
    </>
  );
};

export default PrivateRoute;
