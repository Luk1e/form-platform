import { Typography, Space } from "antd";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const FormHeader = ({ title, description, username, createdAt }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="border-b pb-6">
      <Title level={2} className="!mb-4">
        {title}
      </Title>
      {description && (
        <Paragraph className="text-base mb-4">{description}</Paragraph>
      )}
      <Space size="large" className="text-sm">
        <Space>
          <UserOutlined className="opacity-60" />
          <Text type="secondary">{username}</Text>
        </Space>
        <Space>
          <ClockCircleOutlined className="opacity-60" />
          <Text type="secondary">{formatDate(createdAt)}</Text>
        </Space>
      </Space>
    </div>
  );
};

export default FormHeader;
