import { useEffect } from "react";
import { Button, App } from "antd";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form as FormikForm } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { QuestionField } from "./components";
import { useCustomNavigate } from "../../../utils/hooks";
import { validationSchema, handleSubmit } from "./values";
import { resetUpdateFormState } from "../../../toolkit/user/updateFormSlice";

function UpdateForm({ form, template }) {
  const dispatch = useDispatch();
  const { id, formId } = useParams();
  const { notification } = App.useApp();
  const { t } = useTranslation(["auth"]);
  const goBackOrNavigate = useCustomNavigate(`/templates/${id}`);
  const { success, loading, error } = useSelector((state) => state.updateForm);

  useEffect(() => {
    if (success) {
      notification.success({
        message: t("notifications.formSubmitted"),
        description: t("notifications.formSubmittedDesc"),
      });
      goBackOrNavigate();
    }
    return () => {
      dispatch(resetUpdateFormState());
    };
  }, [dispatch, success, id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      notification.error({
        message: error.message,
      });
    }
  }, [dispatch, error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Formik
      initialValues={form.initialValues}
      validationSchema={validationSchema(template.TemplateQuestions, t)}
      onSubmit={(values) => handleSubmit(formId, template, values, dispatch)}
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

export default UpdateForm;
