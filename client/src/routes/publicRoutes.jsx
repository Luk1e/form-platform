import { lazy } from "react";
import { PublicLayout } from "../layouts";

const HomePage = lazy(() => import("../pages/app/home/HomePage"));
const LoginPage = lazy(() => import("../pages/app/login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/app/register/RegisterPage"));
const ErrorPage = lazy(() => import("../pages/app/error/ErrorPage"));

export default function PublicRoutes() {
  return {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },

      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  };
}
