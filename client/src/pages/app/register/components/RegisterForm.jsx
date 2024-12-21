import React, { useEffect } from "react";
import { Form, Alert, App } from "antd";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../../../toolkit/auth/registerSlice";
import { initialValues, validationSchema, onSubmit } from "../values";
import InputComponents from "./InputComponents";
import ButtonComponent from "./ButtonComponent";

const RegisterForm = () => {
  const { t } = useTranslation(["app"]);
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.register);
  const { notification } = App.useApp();

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema(t),
    onSubmit: (values) => onSubmit({ values, dispatch }),
  });

  useEffect(() => {
    if (success) {
      notification.success({
        message: t("notifications.registerSuccess"),
        description: t("notifications.welcomeAbroad"),
        className: `
        !bg-purple-1 dark:!bg-purple-8 
        [&_.ant-notification-notice-message]:!text-purple-9 
        [&_.ant-notification-notice-message]:dark:!text-purple-2
        [&_.ant-notification-notice-description]:!text-purple-7
        [&_.ant-notification-notice-description]:dark:!text-purple-3
        [&_.ant-notification-notice-icon]:!text-purple-6 
        [&_.ant-notification-notice-icon]:dark:!text-purple-3
        [&_.ant-notification-notice-close]:!text-purple-6
        [&_.ant-notification-notice-close]:dark:!text-purple-3
        [&_.ant-notification-notice-close]:hover:!text-purple-8
        [&_.ant-notification-notice-close]:dark:hover:!text-purple-1
        !border-purple-3 dark:!border-purple-7
        `,
      });
      formik.resetForm();
    }
    return () => {
      dispatch(reset());
    };
  }, [success, dispatch, t, notification]);

  return (
    <Form onFinish={formik.handleSubmit} className="w-full max-w-md space-y-6">
      {error && (
        <Alert
          type="error"
          message={t(`errors.${error.errorCode}`)}
          className="mb-4 border-purple-3 dark:border-purple-7
            bg-purple-1 dark:bg-purple-8
            text-purple-9 dark:text-purple-2
            [&_.ant-alert-icon]:text-purple-6 
            dark:[&_.ant-alert-icon]:text-purple-3
            shadow-sm rounded-md"
          showIcon
        />
      )}
      <InputComponents t={t} formik={formik} />
      <ButtonComponent t={t} isLoading={isLoading} />
    </Form>
  );
};

export default RegisterForm;
