import { LinearProgress } from "@mui/material";
import { Fragment, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import Bikes from "../pages/bikes";
import AvailableBikes from "../pages/bikes/available-bikes";
import UserHistory from "../pages/users/user-history";
import BikeHistory from "../pages/bikes/bike-history";
import NotFound from "../pages/notFound";
import Users from "../pages/users";
import { UserRole } from "../utils/type";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const routes = [
  {
    path: "/",
    access: "private",
    element: <Navigate to="/users" />,
    roles: [UserRole.Manager],
  },
  {
    path: "/login",
    access: "public",
    element: <Login />,
  },
  {
    path: "/register",
    access: "public",
    element: <Register />,
  },
  {
    path: "/users",
    access: "private",
    element: <Users />,
    roles: [UserRole.Manager],
  },
  {
    path: "/user/:userId/history",
    access: "private",
    element: <UserHistory />,
    roles: [UserRole.Manager],
  },
  {
    path: "/bike/:bikeId/history",
    access: "private",
    element: <BikeHistory />,
    roles: [UserRole.Manager],
  },
  {
    path: "/bikes",
    access: "private",
    element: <Bikes />,
    roles: [UserRole.Manager, UserRole.User],
  },
  {
    path: "/available-bikes",
    access: "private",
    element: <AvailableBikes />,
    roles: [UserRole.User],
  },
];

export const renderRoutes = () => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <Routes>
        {routes.map((route, i: number) => {
          if (route.access === "private") {
            return (
              <Route
                key={i}
                path={route.path}
                element={
                  <PrivateRoute roles={route.roles}>
                    {route.element}
                  </PrivateRoute>
                }
              />
            );
          } else if (route.access === "public") {
            return (
              <Route
                key={i}
                path={route.path}
                element={<PublicRoute>{route.element}</PublicRoute>}
              />
            );
          } else {
            return <Fragment key={i}>{route.element}</Fragment>;
          }
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default routes;
