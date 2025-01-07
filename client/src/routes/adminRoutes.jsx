import { lazy } from "react";
import { AdminLayout } from "../layouts";

const UsersPage = lazy(() => import("../pages/admin/UsersPage"));

export default function AdminRoutes({ user, loading }) {
  return {
    path: "/admin",
    element: <AdminLayout user={user} loading={loading} />,
    children: [
      {
        path: "users",
        element: <UsersPage />,
      },
    ],
  };
}
