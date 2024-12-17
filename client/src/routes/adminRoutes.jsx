import { AdminLayout } from "../layouts";

export default function AdminRoutes({ user }) {
  return {
    path: "/admin",
    element: <AdminLayout user={user} />,
    children: [],
  };
}
