import { lazy } from "react";
import { PublicLayout } from "../layouts";

const HomePage = lazy(() => import("../pages/app/home/HomePage"));
const LoginPage = lazy(() => import("../pages/app/login/LoginPage"));
const ErrorPage = lazy(() => import("../pages/app/error/ErrorPage"));
const SearchPage = lazy(() => import("../pages/app/search/SearchPage"));
const RegisterPage = lazy(() => import("../pages/app/register/RegisterPage"));
const TemplatePage = lazy(() => import("../pages/app/template/TemplatePage"));

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
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "templates/:id",
        element: <TemplatePage />,
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
