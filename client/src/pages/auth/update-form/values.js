import * as Yup from "yup";
import { transformAnswerValue } from "../../../utils/helpers";
import { updateForm } from "../../../toolkit/user/updateFormSlice";

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
        fieldValidation = Yup.array().of(Yup.string());
        if (question.is_required) {
          fieldValidation = fieldValidation.min(
            1,
            t("validation.selectAtLeastOne")
          );
        }
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

export const handleSubmit = async (formId, template, values, dispatch) => {
  const answersArray = transformAnswerValue(values, template);
  dispatch(updateForm({ formId, answers: answersArray }));
};
