import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useQueryMe } from "../graphql/quries/me";
import { UserRole } from "../utils/type";

type RouterProps = {
  label: string;
  path: string;
  icon: ReactNode;
};

const managerRouters: RouterProps[] = [
  {
    label: "Users",
    path: "/users",
    icon: <GroupIcon />,
  },
  {
    label: "Bikes",
    path: "/bikes",
    icon: <MenuIcon />,
  },
];

const userRouters: RouterProps[] = [
  {
    label: "My Bikes",
    path: "/bikes",
    icon: <MenuIcon />,
  },
  {
    label: "Available Bikes",
    path: "/available-bikes",
    icon: <MenuIcon />,
  },
];

const Navigation = () => {
  const { data: me } = useQueryMe();
  const { pathname } = window.location;

  const routes = me?.role === UserRole.Manager ? managerRouters : userRouters;

  return (
    <Box sx={{ minWidth: 240 }} mt={4}>
      {routes.map((router: RouterProps) => (
        <NavLink
          key={router.label.toLowerCase()}
          to={router.path}
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <Box
            display={"flex"}
            alignItems="center"
            p={2}
            sx={{
              backgroundColor: pathname.includes(router.path)
                ? "gainsboro"
                : "white",
            }}
          >
            {router.icon}
            <Box ml={2}>{router.label}</Box>
          </Box>
        </NavLink>
      ))}
    </Box>
  );
};

export default Navigation;
