import { lazy } from "react";
import { AuthorizedLayout } from "../layouts";

const ContentPage = lazy(() => import("../pages/auth/content/ContentPage"));

const CreateTemplatePage = lazy(() =>
  import("../pages/auth/create-template/CreateTemplatePage")
);
const UpdateTemplatePage = lazy(() =>
  import("../pages/auth/update-template/UpdateTemplatePage")
);
const TemplateFormsPage = lazy(() =>
  import("../pages/auth/template-forms/TemplateFormsPage")
);

const FormPage = lazy(() => import("../pages/auth/form/FormPage"));
const CreateFormPage = lazy(() =>
  import("../pages/auth/create-form/CreateFormPage")
);
const UpdateFormPage = lazy(() =>
  import("../pages/auth/update-form/UpdateFormPage")
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
        path: "/templates/:id/fill",
        element: <CreateFormPage />,
      },
      {
        path: "/templates/:id/forms",
        element: <TemplateFormsPage />,
      },
      {
        path: "/templates/:id/forms/:formId",
        element: <FormPage />,
      },
      {
        path: "/templates/:id/forms/:formId/update",
        element: <UpdateFormPage />,
      },
      {
        path: "/my-content",
        element: <ContentPage />,
      },
    ],
  };
}
