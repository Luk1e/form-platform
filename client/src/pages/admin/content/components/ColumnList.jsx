import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const FormColumns = () => {
  const { t } = useTranslation(["admin"]);

  return [
    {
      title: t("adminContentPage.id"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("adminContentPage.templateTitle"),
      dataIndex: ["template", "title"],
      key: "template_title",
      render: (text, record) => (
        <Link to={`/templates/${record.template.id}/forms/${record.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: t("adminContentPage.username"),
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: t("adminContentPage.email"),
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: t("adminContentPage.createdAt"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];
};

export const TemplateColumns = () => {
  const { t } = useTranslation(["admin"]);

  return [
    {
      title: t("adminContentPage.id"),
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("adminContentPage.title"),
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link to={`/templates/${record.id}/update`}>{text}</Link>
      ),
    },
    {
      title: t("adminContentPage.author"),
      dataIndex: ["author", "username"],
      key: "author_username",
    },
    {
      title: t("adminContentPage.authorEmail"),
      dataIndex: ["author", "email"],
      key: "author_email",
    },
    {
      title: t("adminContentPage.createdAt"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];
};
