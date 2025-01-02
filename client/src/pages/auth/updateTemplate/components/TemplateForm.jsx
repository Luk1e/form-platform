import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getTags } from "../../../../toolkit/support/tagSlice";
import { getUsers } from "../../../../toolkit/support/userSlice";
import { getTopics } from "../../../../toolkit/support/topicSlice";
import { resetUpdateTemplateState } from "../../../../toolkit/templates/updateTemplateSlice";
import {
  validationSchema,
  handleSubmit,
  mapTemplateToFormValues,
} from "../values";

import BasicInfo from "./BasicInfo";
import { Button, App, Alert } from "antd";
import QuestionList from "./QuestionList";

const TemplateForm = ({ templateId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { t } = useTranslation(["auth"]);

  const { template } = useSelector((state) => state.template);

  const { updatedTemplateId, loading, error } = useSelector(
    (state) => state.updateTemplate
  );

  const { topics } = useSelector((state) => state.supportTopics);
  const { tags } = useSelector((state) => state.supportTags);
  const { users } = useSelector((state) => state.supportUsers);

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
  }, [updatedTemplateId, navigate, dispatch, t]);

  useEffect(() => {
    dispatch(getTags());
    dispatch(getUsers());
    dispatch(getTopics());
  }, [dispatch]);

  const initialValues = mapTemplateToFormValues(template);

  console.log(template);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema(t)}
      onSubmit={(values) => handleSubmit(values, templateId, dispatch)}
      enableReinitialize
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
              {t("updateTemplatePage.updateTemplate")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TemplateForm;
