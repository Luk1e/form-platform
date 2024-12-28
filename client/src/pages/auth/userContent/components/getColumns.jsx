import { Button, Popconfirm, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export const getFormColumns = (t) => [
  {
    title: t("userContentPage.templateTitle"),
    dataIndex: "template_title",
    key: "template_title",
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

export const getTemplateColumns = (t, handleDelete) => [
  {
    title: t("userContentPage.title"),
    dataIndex: "title",
    key: "title",
  },
  {
    title: t("userContentPage.formCount"),
    dataIndex: "form_count",
    key: "form_count",
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
