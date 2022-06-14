import { Box } from "@mui/material";
import { ReactNode } from "react";
import NavBar from "./NavBar";
import { isAuthenticated } from "../utils/common/authentication";
import { Navigate } from "react-router-dom";

const Guard = ({ children }: { children: ReactNode }) => {
  if (!isAuthenticated() && window.location.pathname !== "/login") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <NavBar />
      <Box sx={{ display: "flex" }} mt={5}>
        {children}
      </Box>
    </>
  );
};

export default Guard;
