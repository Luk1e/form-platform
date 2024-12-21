import * as Yup from "yup";
import { register } from "../../../toolkit/auth/registerSlice";

export const initialValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const validationSchema = (t) =>
  Yup.object({
    username: Yup.string()
      .min(3, t("validation.usernameMin"))
      .max(50, t("validation.usernameMax"))
      .required(t("validation.required")),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, t("validation.invalidEmail"))
      .required(t("validation.required")),
    password: Yup.string()
      .min(8, t("validation.passwordMin"))
      .matches(/[0-9]/, t("validation.passwordNumber"))
      .matches(/[A-Z]/, t("validation.passwordUpper"))
      .matches(/[a-z]/, t("validation.passwordLower"))
      .matches(/[^A-Za-z0-9]/, t("validation.passwordSymbol"))
      .required(t("validation.required")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("validation.passwordMatch"))
      .required(t("validation.required")),
  });

export const onSubmit = ({ values, dispatch }) => {
  delete values.confirmPassword;
  dispatch(register(values));
};
