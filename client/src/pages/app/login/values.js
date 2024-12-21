import * as Yup from "yup";
import { login } from "../../../toolkit/auth/loginSlice";

export const initialValues = {
  email: "",
  password: "",
};

export const validationSchema = (t) =>
  Yup.object({
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, t("validation.invalidEmail"))
      .required(t("validation.required")),
    password: Yup.string()
      .min(8, t("validation.passwordMin"))
      .required(t("validation.required")),
  });

export const onSubmit = ({ values, dispatch }) => {
  dispatch(login(values));
};
