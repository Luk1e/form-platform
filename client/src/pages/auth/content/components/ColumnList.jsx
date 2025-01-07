import { Link } from "react-router-dom";
import { Button, Popconfirm, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";

export const FormColumns = () => {
  const { t } = useTranslation(["auth"]);

  return [
    {
      title: t("userContentPage.templateTitle"),
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link to={`/templates/${record.template_id}/forms/${record.id}`}>
          {text}
        </Link>
      ),
    },
    {
      title: t("userContentPage.templateDescription"),
      dataIndex: "template_description",
      key: "template_description",
      ellipsis: true,
    },
    {
      title: t("userContentPage.createdAt"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];
};

export const TemplateColumns = (handleDelete) => {
  const { t } = useTranslation(["auth"]);

  return [
    {
      title: t("userContentPage.title"),
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link to={`/templates/${record.id}/update`}>{text}</Link>
      ),
    },
    {
      title: t("userContentPage.formCount"),
      dataIndex: "form_count",
      key: "form_count",
      render: (count) => (
        <>
          <FormOutlined className="mr-2" />
          {count}
        </>
      ),
    },
    {
      title: t("userContentPage.isPublic"),
      key: "is_public",
      render: (_, record) => (
        <Tag color={record.is_public ? "green" : "red"}>
          {record.is_public
            ? t("userContentPage.public")
            : t("userContentPage.private")}
        </Tag>
      ),
    },
    {
      title: t("userContentPage.createdAt"),
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("userContentPage.actions"),
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title={t("userContentPage.deleteConfirm")}
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];
};
