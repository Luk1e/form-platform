import { useEffect } from "react";
import { useFormik } from "formik";
import { Form, Alert, App } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { reset } from "../../../toolkit/auth/registerSlice";
import { initialValues, validationSchema, onSubmit } from "./values";

import { Input, Button } from "./components";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation(["app"]);
  const { loading, error, success } = useSelector((state) => state.register);
  const { notification } = App.useApp();

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema(t),
    onSubmit: (values) => onSubmit(values, dispatch),
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
  }, [success, dispatch, notification]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      formik.touched.username ||
      formik.touched.email ||
      formik.touched.password ||
      formik.touched.confirmPassword
    ) {
      formik.validateForm();
    }
  }, [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form onFinish={formik.handleSubmit} className="w-full max-w-md space-y-6">
      {error && (
        <Alert
          type="error"
          message={
            error?.errorCode
              ? t(`errors.${error.errorCode}`)
              : error.errors
              ? error.errors[0]?.message // for backend validation errors
              : error.message
          }
          className="mb-4 shadow-sm rounded-md"
          showIcon
        />
      )}
      <Input formik={formik} />
      <Button loading={loading} />
    </Form>
  );
};

export default RegisterForm;
