import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Button, Spin, Typography, Alert, App } from "antd";
import { Formik, Form as FormikForm } from "formik";
import {
  getTemplateById,
  resetGetTemplateState,
} from "../../../toolkit/templates/getTemplateSlice";
import QuestionField from "./components/QuestionField";
import { validationSchema, handleSubmit } from "./values";
import { getForm, resetGetFormState } from "../../../toolkit/user/getFormSlice";
const { Title, Text } = Typography;

function UpdateFormPage() {
  const [t] = useTranslation(["auth"]);
  const dispatch = useDispatch();
  const { id, formId } = useParams();
  const { notification } = App.useApp();
  const navigate = useNavigate();

  const {
    template,
    error: errorTemplate,
    loading: loadingTemplate,
  } = useSelector((state) => state.template);
  const { form, error, loading } = useSelector((state) => state.getForm);

  useEffect(() => {
    dispatch(getTemplateById({ id }));
    dispatch(getForm(formId));

    return () => {
      dispatch(resetGetTemplateState());
      dispatch(resetGetFormState());
    };
  }, [id, formId, dispatch]);

  if (loadingTemplate || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (errorTemplate || error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert
          type="error"
          message={
            errorTemplate
              ? errorTemplate.errorCode
                ? t(`errors.${errorTemplate.errorCode}`)
                : error.message
              : error.errorCode
              ? t(`errors.${error.errorCode}`)
              : error.message
          }
          className="max-w-md"
        />
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="shadow-lg rounded-2xl" bordered={false}>
        <div className="space-y-6">
          <div className="border-b pb-6">
            <Title level={2} className="!mb-2">
              {template.title}
            </Title>
            {template.description && (
              <Text className="text-base opacity-85">
                {template.description}
              </Text>
            )}
          </div>

          <Formik
            initialValues={form.initialValues}
            validationSchema={validationSchema(template.TemplateQuestions, t)}
            onSubmit={(values) =>
              handleSubmit(
                id,
                formId,
                template,
                values,
                dispatch,
                t,
                notification,
                navigate
              )
            }
          >
            {({ submitForm }) => (
              <FormikForm className="space-y-8">
                {template.TemplateQuestions.map((question) => (
                  <QuestionField
                    key={question.id}
                    question={question}
                    name={`question_${question.id}`}
                  />
                ))}

                <div className="pt-6 border-t">
                  <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    className="w-full sm:w-auto min-w-[200px]"
                    onClick={submitForm}
                  >
                    {t("form.submit")}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
      </Card>
    </div>
  );
}

export default UpdateFormPage;
