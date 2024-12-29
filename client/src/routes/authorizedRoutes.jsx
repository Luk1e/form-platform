import { lazy } from "react";
import { AuthorizedLayout } from "../layouts";

const CreateTemplatePage = lazy(() =>
  import("../pages/auth/createTemplate/CreateTemplatePage")
);

const UpdateTemplatePage = lazy(() =>
  import("../pages/auth/updateTemplate/UpdateTemplatePage")
);

const UserContentPage = lazy(() =>
  import("../pages/auth/userContent/UserContentPage")
);

export default function AuthorizedRoutes({ user, loading }) {
  return {
    path: "/",
    element: <AuthorizedLayout user={user} loading={loading} />,
    children: [
      {
        path: "/templates/create",
        element: <CreateTemplatePage />,
      },
      {
        path: "/templates/:id/update",
        element: <UpdateTemplatePage />,
      },
      {
        path: "/my-content",
        element: <UserContentPage />,
      },
    ],
  };
}
