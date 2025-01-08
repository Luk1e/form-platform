import { useEffect } from "react";
import { Button, App } from "antd";
import { useTranslation } from "react-i18next";
import { Formik, Form as FormikForm } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { QuestionField } from "./components";
import { validationSchema, handleSubmit } from "./values";
import { resetCreateFormState } from "../../../toolkit/user/createFormSlice";

function CreateForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { t } = useTranslation(["auth"]);
  const { template } = useSelector((state) => state.template);
  const { success, loading, error } = useSelector((state) => state.createForm);

  useEffect(() => {
    if (success) {
      notification.success({
        message: t("notifications.formSubmitted"),
        description: t("notifications.formSubmittedDesc"),
      });
      navigate(`/templates/${id}`);
    }
    return () => {
      dispatch(resetCreateFormState());
    };
  }, [dispatch, navigate, success, id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      notification.error({
        message: error.message,
      });
    }
  }, [dispatch, error]); // eslint-disable-line react-hooks/exhaustive-deps

  const initialValues = template.TemplateQuestions.reduce((acc, question) => {
    acc[`question_${question.id}`] = question.QuestionType.id === 4 ? [] : "";
    return acc;
  }, {});

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema(template.TemplateQuestions, t)}
      onSubmit={(values) =>
        handleSubmit(id, template, values, dispatch, t, notification, navigate)
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
  );
}

export default CreateForm;
