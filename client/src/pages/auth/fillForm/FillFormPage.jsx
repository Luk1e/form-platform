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
const { Title, Text } = Typography;

const FillFormPage = () => {
  const [t] = useTranslation(["auth"]);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const {
    template,
    error: errorTemplate,
    loading: loadingTemplate,
  } = useSelector((state) => state.template);
  const { loading } = useSelector((state) => state.createForm);

  useEffect(() => {
    if (id) dispatch(getTemplateById({ id }));

    return () => dispatch(resetGetTemplateState());
  }, [id, dispatch]);

  if (loadingTemplate) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (errorTemplate) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert
          type="error"
          message={
            errorTemplate.errorCode
              ? t(`errors.${errorTemplate.errorCode}`)
              : errorTemplate.message
          }
          className="max-w-md"
        />
      </div>
    );
  }

  if (!template) return null;

  const initialValues = template.TemplateQuestions.reduce((acc, question) => {
    acc[`question_${question.id}`] = question.QuestionType.id === 4 ? [] : "";
    return acc;
  }, {});

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
            initialValues={initialValues}
            validationSchema={validationSchema(template.TemplateQuestions, t)}
            onSubmit={(values) =>
              handleSubmit(
                id,
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
};

export default FillFormPage;
