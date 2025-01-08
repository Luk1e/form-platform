import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ColumnList(template) {
  const { t } = useTranslation(["auth"]);

  const baseColumns = [
    {
      title: t("templateFormPage.table.id"),
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: t("templateFormPage.table.author"),
      dataIndex: ["user", "username"],
      key: "username",
      width: 150,
      render: (text, record) => <Link to={`/forms/${record.id}`}>{text}</Link>,
    },
    {
      title: t("templateFormPage.table.email"),
      dataIndex: ["user", "email"],
      key: "email",
      width: 200,
    },
    {
      title: t("templateFormPage.table.submitted"),
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const questionColumns =
    template?.summary_questions?.map((question) => ({
      title: question.title,
      key: question.id,
      dataIndex: ["answers", question.id, "value"],
      width: 200,
      render: (value) => {
        if (Array.isArray(value)) {
          return value.join(", ");
        }
        return value || "-";
      },
    })) || [];

  return [...baseColumns, ...questionColumns];
}

export default ColumnList;
