import { Form, Input, Checkbox, Radio, InputNumber, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useField } from "formik";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const QuestionField = ({ question, name }) => {
  const [field, meta, helpers] = useField(name);
  const [t] = useTranslation(["auth"]);

  const renderField = () => {
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
  };

  return (
    <Form.Item
      validateStatus={meta.touched && meta.error ? "error" : ""}
      help={meta.touched && meta.error}
      className="mb-6"
    >
      <Title level={5} className="!mb-2 !text-base font-medium">
        {question.title}
        {question.is_required && (
          <Text type="danger" className="ml-1">
            *
          </Text>
        )}
      </Title>
      {question.description && (
        <div className="flex items-start gap-2 mb-3">
          <InfoCircleOutlined className="mt-1 opacity-60" />
          <Text className="text-sm opacity-85">{question.description}</Text>
        </div>
      )}
      {renderField()}
    </Form.Item>
  );
};

export default QuestionField;
