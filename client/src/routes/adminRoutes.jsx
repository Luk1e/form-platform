import { lazy } from "react";
import { AdminLayout } from "../layouts";

const UserPage = lazy(() => import("../pages/admin/users/UserPage"));
const ContentPage = lazy(() => import("../pages/admin/contents/ContentPage"));

export default function AdminRoutes({ user, loading }) {
  return {
    path: "/admin",
    element: <AdminLayout user={user} loading={loading} />,
    children: [
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "contents",
        element: <ContentPage />,
      },
    ],
  };
}
