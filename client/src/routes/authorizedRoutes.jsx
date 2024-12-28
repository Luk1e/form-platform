import { lazy } from "react";
import { AuthorizedLayout } from "../layouts";

const CreateTemplatePage = lazy(() =>
  import("../pages/auth/createTemplate/CreateTemplatePage")
);

const UserContentPage = lazy(() =>
  import("../pages/auth/userContent/UserContentPage")
);
export default function AuthorizedRoutes({ user, loading }) {
  return {
    path: "/",
    element: <AuthorizedLayout user={user} />,
    children: [
      {
        path: "/templates/create",
        element: <CreateTemplatePage loading={loading} />,
      },
      {
        path: "/my-content",
        element: <UserContentPage loading={loading} />,
      },
    ],
  };
}
