import { Typography, theme } from "antd";
import AnswerDisplay from "./AnswerDisplay";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const QuestionItem = ({ question, value }) => {
  const { token } = theme.useToken();

  return (
    <div
      className="rounded-lg p-6"
      style={{ backgroundColor: token.colorBgElevated }}
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
        <div className="flex items-start gap-2 mb-4">
          <InfoCircleOutlined className="mt-1 opacity-60" />
          <Text type="secondary" className="text-sm">
            {question.description}
          </Text>
        </div>
      )}
      <div className="mt-3">
        <AnswerDisplay question={question} value={value} />
      </div>
    </div>
  );
};

export default QuestionItem;
