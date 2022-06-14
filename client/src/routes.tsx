import { LinearProgress } from "@mui/material";
import React, { Fragment, Suspense } from "react";
import { Navigate, PathRouteProps, Route, Routes } from "react-router-dom";
import Guard from "./components/Guard";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/notFound";

export type RouteConfig = PathRouteProps & {
  guard?: any;
};

export const renderRoutes = (routes: RouteConfig[]) => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <Routes>
        {routes.map((route: RouteConfig, i: number) => {
          const Guard = route.guard || Fragment;
          const element = route.element as React.ElementType;
          return (
            <Route
              key={i}
              path={route.path}
              element={<Guard>{element}</Guard>}
            />
          );
        })}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const routes = [
  {
    path: "/",
    element: <Navigate to="dashboard" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    guard: Guard,
    element: <Dashboard />,
  },
];

export default routes;
