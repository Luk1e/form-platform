import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserOutlined, FormOutlined } from "@ant-design/icons";

const PopularTemplateColumns = () => {
  const { t } = useTranslation(["app"]);

  return [
    {
      title: t("homePage.templateName"),
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link
          to={`/templates/${record.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {text}
        </Link>
      ),
    },
    {
      title: t("homePage.author"),
      dataIndex: "author",
      key: "author",
      render: (text) => (
        <span className="flex items-center">
          <UserOutlined className="mr-2" />
          {text}
        </span>
      ),
    },
    {
      title: t("homePage.filledForms"),
      dataIndex: "form_count",
      key: "form_count",
      render: (count) => (
        <span className="flex items-center">
          <FormOutlined className="mr-2" />
          {count}
        </span>
      ),
    },
  ];
};

export default PopularTemplateColumns;
