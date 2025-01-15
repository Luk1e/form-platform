import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";

const PersonalInfo = ({ formik }) => {
  const { t } = useTranslation(["auth"]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("salesforce.personalInfo")}</h3>

      <Form.Item
        validateStatus={
          formik.touched.firstName && formik.errors.firstName ? "error" : ""
        }
        help={formik.touched.firstName && formik.errors.firstName}
      >
        <Input
          prefix={<UserOutlined className="text-gray-400" />}
          name="firstName"
          placeholder={t("salesforce.firstName")}
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>

      <Form.Item
        validateStatus={
          formik.touched.lastName && formik.errors.lastName ? "error" : ""
        }
        help={formik.touched.lastName && formik.errors.lastName}
      >
        <Input
          prefix={<UserOutlined className="text-gray-400" />}
          name="lastName"
          placeholder={t("salesforce.lastName")}
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>

      <Form.Item
        validateStatus={
          formik.touched.email && formik.errors.email ? "error" : ""
        }
        help={formik.touched.email && formik.errors.email}
      >
        <Input
          prefix={<MailOutlined className="text-gray-400" />}
          name="email"
          placeholder={t("salesforce.email")}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>

      <Form.Item
        validateStatus={
          formik.touched.phone && formik.errors.phone ? "error" : ""
        }
        help={formik.touched.phone && formik.errors.phone}
      >
        <Input
          prefix={<PhoneOutlined className="text-gray-400" />}
          name="phone"
          placeholder={t("salesforce.phone")}
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Form.Item>
    </div>
  );
};

export default PersonalInfo;
