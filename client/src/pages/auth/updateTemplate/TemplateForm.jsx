import { useEffect } from "react";
import { App, Alert } from "antd";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getTags, resetTagState } from "../../../toolkit/support/tagSlice";
import { getUsers, resetUserState } from "../../../toolkit/support/userSlice";
import {
  getTopics,
  resetTopicState,
} from "../../../toolkit/support/topicSlice";
import { resetUpdateTemplateState } from "../../../toolkit/templates/updateTemplateSlice";

import { Button, BasicInfo, QuestionList } from "./components";
import { validationSchema, handleSubmit, initialValues } from "./values";

const TemplateForm = ({ templateId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { t } = useTranslation(["auth"]);

  const { template } = useSelector((state) => state.template);
  const { updatedTemplateId, loading, error } = useSelector(
    (state) => state.updateTemplate
  );

  useEffect(() => {
    if (updatedTemplateId) {
      notification.success({
        message: t("notifications.templateUpdated"),
        description: t("notifications.templateUpdatedDesc"),
      });
      navigate(`/templates/${updatedTemplateId}`);
    }
    return () => {
      dispatch(resetUpdateTemplateState());
    };
  }, [updatedTemplateId, navigate, dispatch, t]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(getTags());
    dispatch(getUsers());
    dispatch(getTopics());
    return () => {
      dispatch(resetTagState());
      dispatch(resetUserState());
      dispatch(resetTopicState());
    };
  }, [dispatch]);

  return (
    <Formik
      initialValues={initialValues(template)}
      validationSchema={validationSchema(t)}
      onSubmit={(values) => handleSubmit(values, templateId, dispatch)}
      enableReinitialize
    >
      {(formikProps) => (
        <Form className="space-y-6">
          {/* Display error */}
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

          {/* Basic info component */}
          <BasicInfo formikProps={formikProps} />

          {/* Question list component */}
          <QuestionList formikProps={formikProps} />

          {/* Error if no question is selected */}
          {formikProps.touched.questions &&
            typeof formikProps.errors.questions === "string" && (
              <div className="text-red-500 text-sm mt-1">
                {formikProps.errors.questions}
              </div>
            )}

          {/* Submit button component */}
          <Button loading={loading} />
        </Form>
      )}
    </Formik>
  );
};

export default TemplateForm;
