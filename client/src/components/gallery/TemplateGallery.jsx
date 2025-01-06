import { Card } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";

import { getRandomAccent } from "../../utils/helpers";

const TemplateGallery = ({ templates }) => {
  const [t] = useTranslation("app");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {templates.map((template) => (
        <Link
          to={`/templates/${template.id}`}
          key={template.id}
          className="block group"
        >
          <Card
            hoverable
            className="h-full overflow-hidden transition-all duration-300 dark:bg-gray-800"
            styles={{ body: { padding: "16px" } }}
            cover={
              template.image_url ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    alt={template.title}
                    src={template.image_url}
                    className="w-full h-full object-contain bg-gray-50 dark:bg-gray-900"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div
                  className={`relative aspect-[16/9] w-full overflow-hidden ${getRandomAccent()}`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <FileTextOutlined className="text-4xl mb-1" />
                    <div className="text-sm font-medium">
                      {t("homePage.imageNotAvailable")}
                    </div>
                  </div>
                </div>
              )
            }
          >
            <div className="space-y-2.5">
              <div>
                <h3 className="text-base font-medium line-clamp-1 mb-1 group-hover:text-blue-500 dark:text-gray-100 transition-colors">
                  {template.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {template.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <UserOutlined className="text-xs mr-1.5" />
                    <span>{template.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TemplateGallery;
