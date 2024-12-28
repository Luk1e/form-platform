import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getTags } from "../../../../toolkit/support/tagSlice";
import { getUsers } from "../../../../toolkit/support/userSlice";
import { getTopics } from "../../../../toolkit/support/topicSlice";
import { resetCreateTemplateState } from "../../../../toolkit/templates/createTemplateSlice";
import { initialValues, validationSchema, handleSubmit } from "../values";

import BasicInfo from "./BasicInfo";
import { Button, App, Alert } from "antd";
import QuestionList from "./QuestionList";

const TemplateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { t } = useTranslation(["auth"]);

  const { loading, error, createdTemplateId } = useSelector(
    (state) => state.createTemplate
  );
  const { topics } = useSelector((state) => state.supportTopics);
  const { tags } = useSelector((state) => state.supportTags);
  const { users } = useSelector((state) => state.supportUsers);

  useEffect(() => {
    if (createdTemplateId) {
      notification.success({
        message: t("notifications.templateCreated"),
        description: t("notifications.templateCreatedDesc"),
      });
      navigate(`/templates/${createdTemplateId}`);
    }
    return () => {
      dispatch(resetCreateTemplateState());
    };
  }, [createdTemplateId, navigate, dispatch, t]);

  useEffect(() => {
    dispatch(getTags());
    dispatch(getUsers());
    dispatch(getTopics());
  }, [dispatch]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema(t)}
      onSubmit={(values) => handleSubmit(values, dispatch)}
    >
      {(formikProps) => (
        <Form className="space-y-6">
          {error && (
            <Alert
              type="error"
              message={
                error?.errorCode !== undefined
                  ? t("errors." + error.errorCode)
                  : t("validation.invalidEmail")
              }
              className="mb-4 shadow-sm rounded-md"
              showIcon
            />
          )}
          <BasicInfo
            formikProps={formikProps}
            topics={topics}
            tags={tags}
            users={users}
          />
          <QuestionList formikProps={formikProps} />

          {/* Error if no question is selected */}
          {formikProps.touched.questions &&
            typeof formikProps.errors.questions === "string" && (
              <div className="text-red-500 text-sm mt-1">
                {formikProps.errors.questions}
              </div>
            )}

          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full sm:w-auto"
              loading={loading}
            >
              {t("createTemplatePage.createTemplate")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TemplateForm;
