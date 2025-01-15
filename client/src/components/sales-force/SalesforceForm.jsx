import { useEffect } from "react";
import { useFormik } from "formik";
import { Form, Modal, App } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { AccountTypeSelect, PersonalInfo, BusinessInfo } from "./components";
import { initialValues, validationSchema, onSubmit } from "./values";
import { resetCreateAccountState } from "../../toolkit/salesforce/createAccountSlice";

const SalesforceForm = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const { t } = useTranslation(["auth"]);
  const { success, loading, error } = useSelector(
    (state) => state.salesforceCreateAccount
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema(t),
    onSubmit: (values) => onSubmit(values, dispatch),
  });

  useEffect(() => {
    if (success) {
      notification.success({
        message: t("notifications.salesforceSyncSuccess"),
        description: t("notifications.accountCreated"),
      });
      formik.resetForm();
      onClose();
    }
    return () => {
      dispatch(resetCreateAccountState());
    };
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      notification.error({
        message:
          error?.errorCode !== undefined
            ? t("errors." + error.errorCode)
            : t("errors.salesforceSyncFailed"),
      });
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal
      title={t("salesforce.title")}
      open={isOpen}
      onCancel={() => {
        formik.resetForm();
        onClose();
      }}
      onOk={formik.handleSubmit}
      okText={t("salesforce.ok")}
      cancelText={t("global.cancel")}
      confirmLoading={loading}
      width={800}
    >
      <Form layout="vertical" className="space-y-4">
        <AccountTypeSelect formik={formik} />
        <PersonalInfo formik={formik} />
        <BusinessInfo formik={formik} />
      </Form>
    </Modal>
  );
};

export default SalesforceForm;
