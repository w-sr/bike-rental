import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type RouterProps = {
  label: string;
  router: string;
  icon: ReactNode;
};

const routers: RouterProps[] = [
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

const Navigation = () => {
  return (
    <List style={{ width: 240 }}>
      {routers.map((router: RouterProps) => (
        <NavLink
          key={router.label.toLowerCase()}
          to={router.router}
          style={{
            textDecoration: "none",
            backgroundColor: "black",
          }}
        >
          <Box display={"flex"} alignItems="center" p={2}>
            {router.icon}
            <Box ml={2}>{router.label}</Box>
          </Box>
        </NavLink>
      ))}
    </List>
  );
};

export default Navigation;
