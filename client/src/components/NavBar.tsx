import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircle from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import client from "../utils/ApiClient";
import { useQueryMe } from "../utils/quries/me";

type RouterProps = {
  label: string;
  router: string;
  icon: ReactNode;
};

const routers: RouterProps[] = [
  {
    label: "dashboard",
    router: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    label: "Users",
    router: "/users",
    icon: <GroupIcon />,
  },
  {
    label: "Bikes",
    router: "/bikes",
    icon: <MenuIcon />,
  },
];

const NavBar = () => {
  const navigate = useNavigate();
  const { data: me } = useQueryMe();

  const logout = async () => {
    localStorage.removeItem("token");
    client.clearStore();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} display="flex" alignItems={"center"}>
            <Typography variant="h5" component="div" sx={{ marginRight: 3 }}>
              Bike Rental App
            </Typography>
            {me?.role === "manager" &&
              routers.map((router: RouterProps) => (
                <NavLink
                  key={router.label.toLowerCase()}
                  to={router.router}
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  <Box display={"flex"} alignItems="center" p={2}>
                    {router.icon}
                    <Box ml={2}>{router.label}</Box>
                  </Box>
                </NavLink>
              ))}
          </Box>

          <Box display={"flex"} alignItems={"center"}>
            <Typography variant="subtitle1">
              {me?.first_name + " " + me?.last_name}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              size="large"
              aria-label="log out"
              color="inherit"
              onClick={logout}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
