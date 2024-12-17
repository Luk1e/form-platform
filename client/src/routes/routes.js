import { useRoutes } from "react-router-dom";

import PublicRoutes from "./publicRoutes";
import AuthorizedRoutes from "./authorizedRoutes";
import AdminRoutes from "./adminRoutes";

export default function Router({ user }) {
  return useRoutes([
    PublicRoutes(),
    AuthorizedRoutes({ user }),
    AdminRoutes({ user }),
  ]);
}
