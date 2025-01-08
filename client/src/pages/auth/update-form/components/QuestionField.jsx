import { useField } from "formik";
import { Form, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import QuestionInput from "./QuestionInput";

const { Text, Title } = Typography;

const QuestionField = ({ question, name }) => {
  const [meta] = useField(name);

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
      <QuestionInput question={question} name={name} />
    </Form.Item>
  );
};

export default QuestionField;
