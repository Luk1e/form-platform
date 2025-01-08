import * as Yup from "yup";
import { createTemplate } from "../../../toolkit/templates/createTemplateSlice";

export const initialValues = {
  title: "",
  description: "",
  topic_id: undefined,
  is_public: true,
  image_file: null,
  tags: [],
  access_users: [],
  questions: [],
};

export const validationSchema = (t) =>
  Yup.object().shape({
    title: Yup.string()
      .min(3, t("validation.titleMin"))
      .max(255, t("validation.titleMax"))
      .required(t("validation.titleRequired")),
    description: Yup.string()
      .min(3, t("validation.descriptionMin"))
      .max(5000, t("validation.descriptionMax"))
      .required(t("validation.descriptionRequired")),

    topic_id: Yup.number().required(t("validation.topicRequired")),
    is_public: Yup.boolean().required(t("validation.visibilityRequired")),
    access_users: Yup.array().when("is_public", {
      is: false,
      then: () =>
        Yup.array()
          .of(Yup.number())
          .min(1, t("validation.accessUsersMin"))
          .required(t("validation.accessUsersRequired")),
      otherwise: () => Yup.array().nullable(),
    }),
    image_file: Yup.mixed().nullable(),
    tags: Yup.array().of(Yup.string().max(50)).min(1, t("validation.tagsMin")),
    questions: Yup.array()
      .of(
        Yup.object().shape({
          type_id: Yup.number().required(t("validation.questionTypeRequired")),
          title: Yup.string().required(t("validation.questionTitleRequired")),
          description: Yup.string().required(
            t("validation.descriptionRequired")
          ),
          display_in_summary: Yup.boolean().required(
            t("validation.displayRequired")
          ),
          is_required: Yup.boolean(),
          options: Yup.array().when("type_id", {
            is: (value) => value == 4 || value == 5,
            then: () =>
              Yup.array()
                .of(Yup.string().required(t("validation.optionsRequired")))
                .min(1, t("validation.optionsMinOne")),
            otherwise: () => Yup.array().nullable(),
          }),
        })
      )
      .min(1, t("validation.questionsMin")),
  });

export const handleSubmit = (values, dispatch) => {
  dispatch(createTemplate(values));
};
