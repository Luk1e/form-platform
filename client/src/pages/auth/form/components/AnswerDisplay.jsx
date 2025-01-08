import { useTranslation } from "react-i18next";
import { Typography, Space, theme } from "antd";
import { CheckOutlined } from "@ant-design/icons";
const { Text } = Typography;

const AnswerDisplay = ({ question, value }) => {
  const { token } = theme.useToken();
  const { t } = useTranslation(["auth"]);
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return (
      <div
        className="px-3 py-2 rounded-lg"
        style={{ backgroundColor: token.colorBgTextHover }}
      >
        <Text type="secondary">{t("formPage.noAnswerProvided")}</Text>
      </div>
    );
  }

  const renderCheckbox = (answer) => (
    <div
      key={answer}
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ backgroundColor: token.colorBgTextHover }}
    >
      <div className="flex-shrink-0 w-4 h-4 rounded bg-primary flex items-center justify-center">
        <CheckOutlined />
      </div>
      <Text>{answer}</Text>
    </div>
  );

  const renderRadio = (answer) => (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg"
      style={{ backgroundColor: token.colorBgTextHover }}
    >
      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary" />
      <Text>{answer}</Text>
    </div>
  );

  const renderText = (text) => (
    <div
      className="px-3 py-2 rounded-lg"
      style={{ backgroundColor: token.colorBgTextHover }}
    >
      <Text
        className={
          question.QuestionType.id === 2 ? "whitespace-pre-wrap block" : ""
        }
      >
        {text}
      </Text>
    </div>
  );

  switch (question.QuestionType.id) {
    case 4: // checkbox
      return (
        <Space direction="vertical" className="w-full">
          {value.map(renderCheckbox)}
        </Space>
      );
    case 5: // single choice
      return renderRadio(value);
    case 2: // multi-line
      return renderText(value);
    default:
      return renderText(value);
  }
};

export default AnswerDisplay;
