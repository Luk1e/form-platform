import { lazy } from "react";
import { AuthorizedLayout } from "../layouts";

const CreateTemplatePage = lazy(() =>
  import("../pages/auth/createTemplate/CreateTemplatePage")
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
    ],
  };
}
