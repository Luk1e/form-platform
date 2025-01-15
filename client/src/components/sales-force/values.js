import * as Yup from "yup";
import { createSalesforceAccount } from "../../toolkit/salesforce/createAccountSlice";

export const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  accountType: "personal",
  company: "",
  companyPhone: "",
  companyWebsite: "",
};

export const validationSchema = (t) => {
  const personalInfoSchema = {
    firstName: Yup.string()
      .trim()
      .min(2, t("validation.firstNameMin"))
      .max(40, t("validation.firstNameMax"))
      .required(t("validation.firstNameRequired")),
    lastName: Yup.string()
      .trim()
      .min(2, t("validation.lastNameMin"))
      .max(80, t("validation.lastNameMax"))
      .required(t("validation.lastNameRequired")),
    email: Yup.string()
      .email(t("validation.emailInvalid"))
      .max(80, t("validation.emailMax"))
      .required(t("validation.emailRequired")),
    phone: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, t("validation.phoneInvalid"))
      .required(t("validation.phoneRequired")),
    accountType: Yup.string()
      .oneOf(["personal", "business"], t("validation.accountTypeInvalid"))
      .required(t("validation.accountTypeRequired")),
  };

  const businessInfoSchema = {
    company: Yup.string()
      .trim()
      .when("accountType", {
        is: "business",
        then: () =>
          Yup.string()
            .min(2, t("validation.companyNameMin"))
            .max(255, t("validation.companyNameMax"))
            .required(t("validation.companyNameRequired")),
        otherwise: () => Yup.string().strip(),
      }),
    companyPhone: Yup.string().when("accountType", {
      is: "business",
      then: () =>
        Yup.string()
          .matches(/^\+?[1-9]\d{1,14}$/, t("validation.companyPhoneInvalid"))
          .required(t("validation.companyPhoneRequired")),
      otherwise: () => Yup.string().strip(),
    }),
    companyWebsite: Yup.string().when("accountType", {
      is: "business",
      then: () =>
        Yup.string().url(t("validation.companyWebsiteInvalid")).nullable(),
      otherwise: () => Yup.string().strip(),
    }),
  };

  return Yup.object({
    ...personalInfoSchema,
    ...businessInfoSchema,
  });
};

export const onSubmit = (values, dispatch) => {
  if (values.accountType !== "business") {
    values.company = null;
    values.companyPhone = null;
    values.companyWebsite = null;
  }

  dispatch(createSalesforceAccount(values));
};
