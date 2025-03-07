import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

function InputComponents({ formik }) {
  const { t } = useTranslation(["app"]);

  return (
    <div className="space-y-4">
      <Form.Item
        validateStatus={
          formik.touched.username && formik.errors.username ? "error" : ""
        }
        help={
          formik.touched.username && formik.errors.username
            ? t(formik.errors.username)
            : ""
        }
        className="mb-0"
      >
        <Input
          prefix={<UserOutlined />}
          id="username"
          name="username"
          placeholder={t("placeholders.usernamePlaceholder")}
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item
        validateStatus={
          formik.touched.email && formik.errors.email ? "error" : ""
        }
        help={
          formik.touched.email && formik.errors.email
            ? t(formik.errors.email)
            : ""
        }
        className="mb-0"
      >
        <Input
          prefix={<MailOutlined />}
          id="email"
          name="email"
          type="email"
          placeholder={t("placeholders.emailPlaceholder")}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="off"
        />
      </Form.Item>

      <Form.Item
        validateStatus={
          formik.touched.password && formik.errors.password ? "error" : ""
        }
        help={
          formik.touched.password && formik.errors.password
            ? t(formik.errors.password)
            : ""
        }
        className="mb-0"
      >
        <Input.Password
          prefix={<LockOutlined />}
          id="password"
          name="password"
          placeholder={t("placeholders.passwordPlaceholder")}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        validateStatus={
          formik.touched.confirmPassword && formik.errors.confirmPassword
            ? "error"
            : ""
        }
        help={
          formik.touched.confirmPassword && formik.errors.confirmPassword
            ? t(formik.errors.confirmPassword)
            : ""
        }
        className="mb-0"
      >
        <Input.Password
          prefix={<LockOutlined />}
          id="confirmPassword"
          name="confirmPassword"
          placeholder={t("placeholders.confirmPasswordPlaceholder")}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="new-password"
        />
      </Form.Item>
    </div>
  );
}

export default InputComponents;
