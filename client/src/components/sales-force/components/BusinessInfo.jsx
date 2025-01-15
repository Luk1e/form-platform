import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { BankOutlined, GlobalOutlined, PhoneOutlined } from "@ant-design/icons";

const BusinessInfo = ({ formik }) => {
  const { t } = useTranslation(["auth"]);
  if (formik.values.accountType !== "business") return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("salesforce.businessInfo")}</h3>

      <Form.Item
        validateStatus={
          formik.touched.company && formik.errors.company ? "error" : ""
        }
        help={formik.touched.company && formik.errors.company}
      >
        <Input
          prefix={<BankOutlined className="text-gray-400" />}
          name="company"
          placeholder={t("salesforce.companyName")}
          value={formik.values.company}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>

      <Form.Item
        validateStatus={
          formik.touched.companyPhone && formik.errors.companyPhone
            ? "error"
            : ""
        }
        help={formik.touched.companyPhone && formik.errors.companyPhone}
      >
        <Input
          prefix={<PhoneOutlined className="text-gray-400" />}
          name="companyPhone"
          placeholder={t("salesforce.companyPhone")}
          value={formik.values.companyPhone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>

      <Form.Item
        validateStatus={
          formik.touched.companyWebsite && formik.errors.companyWebsite
            ? "error"
            : ""
        }
        help={formik.touched.companyWebsite && formik.errors.companyWebsite}
      >
        <Input
          prefix={<GlobalOutlined className="text-gray-400" />}
          name="companyWebsite"
          placeholder={t("salesforce.companyWebsite")}
          value={formik.values.companyWebsite}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>
    </div>
  );
};

export default BusinessInfo;
