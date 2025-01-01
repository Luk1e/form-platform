import * as Yup from "yup";
import { createForm } from "../../../toolkit/user/createFormSlice";

export const validationSchema = (questions, t) => {
  const schema = {};
  questions.forEach((question) => {
    let fieldValidation;
    switch (question.QuestionType.id) {
      case 1: // single_line
        fieldValidation = Yup.string()
          .min(1, t("validation.minLength", { min: 1 }))
          .max(100, t("validation.maxLength", { max: 100 }));
        break;
      case 2: // multi_line
        fieldValidation = Yup.string()
          .min(1, t("validation.minLength", { min: 1 }))
          .max(1000, t("validation.maxLength", { max: 1000 }));
        break;
      case 3: // integer
        fieldValidation = Yup.number().typeError(t("validation.mustBeNumber"));
        break;
      case 4: // checkbox
        fieldValidation = Yup.array()
          .of(Yup.string())
          .min(1, t("validation.selectAtLeastOne"));
        break;
      case 5: // single_choice
        fieldValidation = Yup.string();
        break;
      default:
        fieldValidation = Yup.string();
    }

    if (question.is_required) {
      fieldValidation = fieldValidation.required(t("validation.required"));
    } else {
      fieldValidation = fieldValidation.nullable();
    }
    schema[`question_${question.id}`] = fieldValidation;
  });
  return Yup.object().shape(schema);
};

// Frontend: values.js - Modified handleSubmit and added helper
const transformAnswerValue = (questionType, value, options) => {
  switch (questionType) {
    case 4: // checkbox
      return value
        .map((val) => options.find((opt) => opt.value === val)?.id)
        .filter(Boolean);
    case 5: // single_choice
      return options.find((opt) => opt.value === value)?.id;
    default:
      return value;
  }
};

export const handleSubmit = async (
  id,
  template,
  values,
  dispatch,
  t,
  notification,
  navigate
) => {
  const answersArray = Object.entries(values).map(([key, value]) => {
    const questionId = parseInt(key.split("_")[1], 10);
    const question = template.TemplateQuestions.find(
      (q) => q.id === questionId
    );

    if (!question) {
      throw new Error(`Question ${questionId} not found in template`);
    }

    const transformedValue = transformAnswerValue(
      question.QuestionType.id,
      value,
      question.QuestionOptions
    );

    return {
      question_id: questionId,
      value: transformedValue,
    };
  });

  try {
    await dispatch(createForm({ id, answers: answersArray })).unwrap();
    notification.success({
      message: t("notifications.formSubmitted"),
      description: t("notifications.formSubmittedDesc"),
    });
    navigate(`/templates/${id}`);
  } catch (error) {
    notification.error({
      message: error.message,
    });
  }
};
