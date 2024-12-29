import * as Yup from "yup";
import { updateTemplate } from "../../../toolkit/templates/updateTemplateSlice";

export const mapTemplateToFormValues = (template) => {
  if (!template) return null;

  return {
    title: template.title,
    description: template.description,
    topic_id: template.template_topic_id,
    is_public: template.is_public,
    image_url: template.image_url,
    image_file: null,
    tags: template.TemplateTags.map((tag) => tag.name),
    access_users: template.is_public
      ? []
      : template.AccessUsers.map((user) => user.id),
    questions: template.TemplateQuestions.map((question) => ({
      type_id: question.QuestionType.id,
      title: question.title,
      description: question.description,
      display_in_summary: question.display_in_summary,
      is_required: question.is_required,
      options: question.QuestionOptions.map((opt) => opt.value) || [],
    })),
  };
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
    image_url: Yup.string().url(t("validation.urlInvalid")).nullable(),
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

export const getQuestionTypes = (t) => [
  { id: 1, name: t("createTemplatePage.singleLine") },
  { id: 2, name: t("createTemplatePage.multiLine") },
  { id: 3, name: t("createTemplatePage.integer") },
  { id: 4, name: t("createTemplatePage.checkbox") },
  { id: 5, name: t("createTemplatePage.singleChoice") },
];

export const handleSubmit = (values, templateId, dispatch) => {
  dispatch(updateTemplate({ id: templateId, templateData: values }));
};
