import { Radio, Checkbox } from "antd";

const RenderQuestionOptions = ({ question }) => {
  switch (question.QuestionType.name) {
    case "single_choice":
      return (
        <Radio.Group className="w-full mt-2" disabled>
          {question.QuestionOptions.map((option) => (
            <Radio
              key={option.id}
              value={option.id}
              className="flex mt-2   dark:text-gray-300"
            >
              {option.value}
            </Radio>
          ))}
        </Radio.Group>
      );
    case "checkbox":
      return (
        <div className="mt-2">
          {question.QuestionOptions.map((option) => (
            <Checkbox
              key={option.id}
              disabled
              className="flex mt-2 dark:text-gray-300"
            >
              {option.value}
            </Checkbox>
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default RenderQuestionOptions;
