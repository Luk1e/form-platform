import { Form, Input } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

function InputComponents({ t, formik }) {
  return (
    <>
      <Form.Item
        validateStatus={
          formik.touched.username && formik.errors.username ? "error" : ""
        }
        help={
          formik.touched.username && formik.errors.username
            ? t(formik.errors.username)
            : ""
        }
      >
        <Input
          prefix={<UserOutlined className="text-purple-5" />}
          id="username"
          name="username"
          placeholder={t("placeholders.usernamePlaceholder")}
          className="dark:bg-purple-7 dark:!text-purple-1 dark:border-purple-6
          [&.ant-input-status-error]:!text-red-600
          dark:[&.ant-input-status-error]:!text-red-400
            [&_*:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(var(--purple-1))_inset_!important]
            dark:[&_*:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(var(--purple-7))_inset_!important]
            [&_*:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
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
      >
        <Input
          prefix={<MailOutlined className="text-purple-5" />}
          id="email"
          name="email"
          type="email"
          placeholder={t("placeholders.emailPlaceholder")}
          className="dark:bg-purple-7 dark:!text-purple-1 dark:border-purple-6
          [&.ant-input-status-error]:!text-red-600
          dark:[&.ant-input-status-error]:!text-red-400
            [&_*:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(var(--purple-1))_inset_!important]
            dark:[&_*:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(var(--purple-7))_inset_!important]
            [&_*:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
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
      >
        <Input.Password
          prefix={<LockOutlined className="text-purple-5" />}
          id="password"
          name="password"
          placeholder={t("placeholders.passwordPlaceholder")}
          className="dark:bg-purple-7 dark:!text-purple-1 dark:border-purple-6
          [&.ant-input-status-error]:!text-red-600
          dark:[&.ant-input-status-error]:!text-red-400
            [&_*:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(var(--purple-1))_inset_!important]
            dark:[&_*:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(var(--purple-7))_inset_!important]
            [&_*:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
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
      >
        <Input.Password
          prefix={<LockOutlined className="text-purple-5" />}
          id="confirmPassword"
          name="confirmPassword"
          placeholder={t("placeholders.confirmPasswordPlaceholder")}
          className="dark:bg-purple-7 dark:!text-purple-1 dark:border-purple-6
          [&.ant-input-status-error]:!text-red-600
          dark:[&.ant-input-status-error]:!text-red-400
            [&_*:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(var(--purple-1))_inset_!important]
            dark:[&_*:-webkit-autofill]:[-webkit-box-shadow:0_0_0_30px_rgb(var(--purple-7))_inset_!important]
            [&_*:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="new-password"
        />
      </Form.Item>
    </>
  );
}

export default InputComponents;
