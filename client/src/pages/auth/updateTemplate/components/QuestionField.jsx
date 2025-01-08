import { FieldArray } from "formik";
import { useTranslation } from "react-i18next";
import { Card, Input, Switch, Button, Form } from "antd";

import { getQuestionTypes } from "../../../../utils/helpers";

const QuestionField = ({ index, remove, formikProps }) => {
  const { t } = useTranslation("auth");
  const { values, handleChange, setFieldValue, touched, errors } = formikProps;

  const question = values.questions[index];
  const questionTypes = getQuestionTypes(t) || [];
  const questionType = questionTypes.find((t) => t.id === question.type_id);

  const getFieldError = (fieldName) => {
    const error = errors.questions?.[index]?.[fieldName];

    return touched.questions?.[index]?.[fieldName] && typeof error === "string"
      ? error
      : null;
  };

  return (
    <Card className="shadow-sm">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          {/* Question header */}
          <h4 className="text-base font-medium">
            {questionType?.name} Question {index + 1}
          </h4>

          {/* Button to remove question */}
          <Button danger onClick={() => remove(index)}>
            {t("createTemplatePage.questions.remove")}
          </Button>
        </div>

        {/* Question title input */}
        <Form.Item
          validateStatus={getFieldError("title") ? "error" : ""}
          help={getFieldError("title")}
        >
          <Input
            name={`questions.${index}.title`}
            placeholder={t("createTemplatePage.questions.questionTitle")}
            onChange={handleChange}
            value={question.title}
            className="w-full"
          />
        </Form.Item>

        {/* Question description input */}
        <Form.Item
          validateStatus={getFieldError("description") ? "error" : ""}
          help={getFieldError("description")}
        >
          <Input.TextArea
            name={`questions.${index}.description`}
            placeholder={t("createTemplatePage.questions.questionDescription")}
            onChange={handleChange}
            value={question.description}
            rows={2}
            className="w-full"
          />
        </Form.Item>

        {/* Question option list */}
        {(question.type_id === 4 || question.type_id === 5) && (
          <FieldArray name={`questions.${index}.options`}>
            {({ push, remove }) => (
              <div className="space-y-2">
                {question.options?.map((_, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
                  >
                    {/* Option text input */}
                    <Form.Item
                      className="flex-1 mb-0"
                      validateStatus={
                        touched.questions?.[index]?.options?.[optionIndex] &&
                        errors.questions?.[index]?.options?.[optionIndex]
                          ? "error"
                          : ""
                      }
                      help={
                        touched.questions?.[index]?.options?.[optionIndex] &&
                        errors.questions?.[index]?.options?.[optionIndex]
                      }
                    >
                      <Input
                        name={`questions.${index}.options.${optionIndex}`}
                        placeholder={t(
                          "createTemplatePage.questions.optionText"
                        )}
                        onChange={handleChange}
                        value={question.options[optionIndex]}
                        className="flex-1"
                      />
                    </Form.Item>

                    {/* Button to remove option */}
                    <Button danger onClick={() => remove(optionIndex)}>
                      {t("createTemplatePage.questions.removeOption")}
                    </Button>
                  </div>
                ))}

                {/* Button to add option */}
                <Button type="dashed" onClick={() => push("")}>
                  {t("createTemplatePage.questions.addOption")}
                </Button>

                {getFieldError("options") && (
                  <div className="text-red-500 text-sm mt-1">
                    {getFieldError("options")}
                  </div>
                )}
              </div>
            )}
          </FieldArray>
        )}

        {/* Buttons  */}
        <div className="flex flex-wrap gap-4">
          {/* Switch summary */}
          <Form.Item className="mb-0">
            <div className="flex items-center space-x-2">
              <Switch
                checked={question.display_in_summary}
                onChange={(value) =>
                  setFieldValue(`questions.${index}.display_in_summary`, value)
                }
              />
              <span className="text-sm sm:text-base">
                {t("createTemplatePage.questions.displayInSummary")}
              </span>
            </div>
          </Form.Item>

          {/* Switch required type */}
          <Form.Item className="mb-0">
            <div className="flex items-center space-x-2">
              <Switch
                checked={question.is_required}
                onChange={(value) =>
                  setFieldValue(`questions.${index}.is_required`, value)
                }
              />
              <span className="text-sm sm:text-base">
                {t("createTemplatePage.questions.required")}
              </span>
            </div>
          </Form.Item>
        </div>
      </div>
    </Card>
  );
};

export default QuestionField;
