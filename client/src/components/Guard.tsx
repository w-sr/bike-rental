import { Box } from "@mui/material";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/common/authentication";
import { useQueryMe } from "../utils/quries/me";
import NavBar from "./NavBar";

const Guard = ({ children }: { children: ReactNode }) => {
  const { data: user } = useQueryMe();
  const { pathname } = window.location;

  if (!isAuthenticated() && !pathname.includes("/login")) {
    return <Navigate to="/login" />;
  }

  // if (user?.role === "manager" && pathname.includes("dashboard")) {
  //   return <Navigate to="/users" />;
  // }

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
