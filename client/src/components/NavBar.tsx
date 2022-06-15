import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useQueryMe } from "../utils/quries/me";
import { useNavigate } from "react-router-dom";
import client from "../utils/ApiClient";

const NavBar = () => {
  const navigate = useNavigate();
  const { data: user } = useQueryMe();

  const logout = async () => {
    localStorage.removeItem("token");
    client.clearStore();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bike Rental App
          </Typography>

          <Box display={"flex"} alignItems={"center"}>
            <Typography variant="h6">
              {user?.first_name + " " + user?.last_name}
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
