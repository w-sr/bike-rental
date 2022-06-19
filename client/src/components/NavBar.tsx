import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import client from "../graphql/ApiClient";
import { useQueryMe } from "../graphql/quries/me";

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
