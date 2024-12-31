import { Tag, Divider } from "antd";
import {
  TagOutlined,
  FolderOutlined,
  LockOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TemplateInfo = ({ template }) => {
  const [t] = useTranslation("app");
  const navigate = useNavigate();

  const searchTemplateByTag = (tagId) => {
    navigate(`/search?tag=${tagId}`);
  };
  return (
    <div className="space-y-6">
      {template.image_url && (
        <img
          src={template.image_url}
          alt={template.title}
          className="w-full max-h-64 object-cover rounded-lg"
        />
      )}

      <p className="text-gray-600 text-base">{template.description}</p>

      <div className="space-y-4">
        {/* Topic Section */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <FolderOutlined />
            <span className="font-medium">{t("templatePage.topic")}</span>
          </div>
          <Tag
            color="processing"
            className="text-sm px-3 py-1 rounded-full border-0"
            icon={<FolderOutlined />}
          >
            {template.TemplateTopic.name}
          </Tag>
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <TagOutlined />
            <span className="font-medium">{t("templatePage.tags")}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {template.TemplateTags.map((tag) => (
              <Tag
                key={tag.id}
                onClick={() => searchTemplateByTag(tag.id)}
                className="text-sm px-3 py-1 cursor-pointer rounded-full 
                dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-300
                bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700
                transition-colors duration-200"
              >
                {tag.name}
              </Tag>
            ))}
          </div>
        </div>

        <Divider className="my-4" />

        {/* Visibility Section */}
        <div className="flex items-center gap-2">
          {template.is_public ? (
            <Tag
              icon={<GlobalOutlined />}
              color="success"
              className="text-sm px-3 py-1 rounded-full border-0"
            >
              {t("templatePage.public")}
            </Tag>
          ) : (
            <Tag
              icon={<LockOutlined />}
              color="warning"
              className="text-sm px-3 py-1 rounded-full border-0"
            >
              {t("templatePage.private")}
            </Tag>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateInfo;
