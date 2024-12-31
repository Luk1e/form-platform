import { Space, Button, Tooltip } from "antd";
import { HeartOutlined, HeartFilled, MessageOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const TemplateFooter = ({ likeCount, commentCount, hasLiked, username }) => {
  const [t] = useTranslation("app");

  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <Space size="large">
        <div className="flex items-center gap-1">
          <Tooltip title={t("templatePage.toggleLike")}>
            <Button
              type="text"
              icon={
                hasLiked ? (
                  <HeartFilled className="text-red-500" />
                ) : (
                  <HeartOutlined />
                )
              }
            />
          </Tooltip>
          <span>{likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageOutlined />
          <span>{commentCount}</span>
        </div>
      </Space>
      <div className="text-sm text-gray-500">
        {t("templatePage.createdBy")}: {username}
      </div>
    </div>
  );
};

export default TemplateFooter;
