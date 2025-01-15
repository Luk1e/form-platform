import { Form, Radio } from "antd";
import { useTranslation } from "react-i18next";

const AccountTypeSelect = ({ formik }) => {
  const { t } = useTranslation(["auth"]);
  return (
    <Form.Item
      label={t("salesforce.accountType")}
      validateStatus={
        formik.touched.accountType && formik.errors.accountType ? "error" : ""
      }
      help={formik.touched.accountType && formik.errors.accountType}
    >
      <Radio.Group
        name="accountType"
        value={formik.values.accountType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      >
        <Radio value="personal">{t("salesforce.personal")}</Radio>
        <Radio value="business">{t("salesforce.business")}</Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export default AccountTypeSelect;
