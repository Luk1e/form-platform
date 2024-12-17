import { AuthorizedLayout } from "../layouts";

export default function AuthorizedRoutes({ user }) {
  return {
    path: "/",
    element: <AuthorizedLayout user={user} />,
    children: [],
  };
}
