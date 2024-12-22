import { Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

function InputComponents({ t, formik }) {
  return (
    <>
      <Form.Item
        validateStatus={
          formik.touched.email && formik.errors.email ? "error" : ""
        }
        help={
          formik.touched.email && formik.errors.email
            ? t(formik.errors.email)
            : ""
        }
      >
        <Input
          prefix={<UserOutlined />}
          id="email"
          name="email"
          type="email"
          placeholder={t("placeholders.emailPlaceholder")}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="on"
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
      >
        <Input.Password
          prefix={<LockOutlined />}
          id="password"
          name="password"
          placeholder={t("placeholders.passwordPlaceholder")}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="on"
        />
      </Form.Item>
    </>
  );
}

export default InputComponents;
