import { useField } from "formik";
import { useTranslation } from "react-i18next";
import { Input, Checkbox, Radio, InputNumber } from "antd";

function QuestionInput({ question, name }) {
  const { t } = useTranslation(["auth"]);
  const [field, meta, helpers] = useField(name);

  const commonProps = {
    ...field,
    status: meta.touched && meta.error ? "error" : "",
    onChange: (val) => {
      const value = val?.target?.value ?? val;
      helpers.setValue(value);
      if (meta.touched) {
        helpers.setError(undefined);
      }
    },
    onBlur: () => helpers.setTouched(true),
    className: "w-full",
    placeholder: t("placeholder.enterText"),
  };

  switch (question.QuestionType.id) {
    case 1:
      return <Input {...commonProps} className="rounded-lg" />;
    case 2:
      return (
        <Input.TextArea
          {...commonProps}
          rows={3}
          className="rounded-lg"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      );
    case 3:
      return (
        <InputNumber
          {...commonProps}
          controls={false}
          className="w-full rounded-lg"
        />
      );
    case 4:
      return (
        <Checkbox.Group
          {...commonProps}
          className="flex flex-col space-y-2"
          onChange={(val) => {
            helpers.setValue(val);
            if (val.length > 0) {
              helpers.setError(undefined);
            }
          }}
        >
          {question.QuestionOptions.map((option) => (
            <div
              key={option.id}
              className="rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Checkbox value={option.value} className="w-full p-3">
                {option.value}
              </Checkbox>
            </div>
          ))}
        </Checkbox.Group>
      );
    case 5:
      return (
        <Radio.Group
          {...commonProps}
          className="flex flex-col space-y-2"
          onChange={(e) => {
            helpers.setValue(e.target.value);
            if (e.target.value) {
              helpers.setError(undefined);
            }
          }}
        >
          {question.QuestionOptions.map((option) => (
            <div
              key={option.id}
              className="rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Radio value={option.value} className="w-full p-3">
                {option.value}
              </Radio>
            </div>
          ))}
        </Radio.Group>
      );
    default:
      return null;
  }
}

export default QuestionInput;
