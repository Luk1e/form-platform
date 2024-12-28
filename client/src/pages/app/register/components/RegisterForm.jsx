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
          message={
            error?.errorCode !== undefined
              ? t(`errors.${error.errorCode}`)
              : error.errors
              ? error.errors[0]?.message
              : error.message
          }
          className="mb-4hadow-sm rounded-md"
          showIcon
        />
      )}
      <InputComponents t={t} formik={formik} />
      <ButtonComponent t={t} isLoading={isLoading} />
    </Form>
  );
};

export default RegisterForm;
