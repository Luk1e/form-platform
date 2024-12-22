import { lazy } from "react";
import { AdminLayout } from "../layouts";

const UsersPage = lazy(() => import("../pages/admin/UsersPage"));

export default function AdminRoutes({ user }) {
  return {
    path: "/admin",
    element: <AdminLayout user={user} />,
    children: [
      {
        index: true,
        element: <UsersPage />,
      },
    ],
  };
}
