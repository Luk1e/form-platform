import React, { useEffect } from "react";
import { Form, Alert, App } from "antd";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "../../../../toolkit/auth/loginSlice";
import { initialValues, validationSchema, onSubmit } from "../values";
import GoogleButton from "../../../../components/google/GoogleButton";
import InputComponents from "./InputComponents";
import ButtonComponent from "./ButtonComponent";

const LoginForm = () => {
  const { t } = useTranslation(["app"]);
  const dispatch = useDispatch();
  const { isLoading, error, success } = useSelector((state) => state.login);
  const { notification } = App.useApp();

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema(t),
    onSubmit: (values) => onSubmit({ values, dispatch }),
  });

  useEffect(() => {
    if (success) {
      notification.success({
        message: t("notifications.loginSuccess"),
        description: t("notifications.welcomeBack"),
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
              ? t("errors." + error.errorCode)
              : t("validation.invalidEmail")
          }
          className="mb-4 shadow-sm rounded-md"
          showIcon
        />
      )}

      <InputComponents t={t} formik={formik} />
      <ButtonComponent t={t} isLoading={isLoading} />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-[#141414]">
            {t("global.orContinueWith")}
          </span>
        </div>
      </div>
      <GoogleButton t={t} />
    </Form>
  );
};

export default LoginForm;
