import { lazy } from "react";
import { AuthorizedLayout } from "../layouts";

const CreateTemplatePage = lazy(() =>
  import("../pages/auth/createTemplate/CreateTemplatePage")
);

const UserContentPage = lazy(() =>
  import("../pages/auth/userContent/UserContentPage")
);
export default function AuthorizedRoutes({ user }) {
  return {
    path: "/",
    element: <AuthorizedLayout user={user} />,
    children: [
      {
        path: "/templates/create",
        element: <CreateTemplatePage />,
      },
      {
        path: "/my-content",
        element: <UserContentPage />,
      },
    ],
  };
}
