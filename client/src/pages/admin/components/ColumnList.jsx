import { Tag } from "antd";
import { useTranslation } from "react-i18next";
import { CrownOutlined, StopOutlined } from "@ant-design/icons";

const ColumnList = () => {
  const { t } = useTranslation(["admin"]);

  return [
    {
      title: t("users.username"),
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: t("users.email"),
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: t("users.isAdmin"),
      key: "is_admin",
      width: 100,
      render: (_, record) =>
        record.is_admin ? (
          <Tag color="purple" icon={<CrownOutlined />}>
            {t("users.adminBadge")}
          </Tag>
        ) : null,
    },
    {
      title: t("users.isBlocked"),
      key: "is_blocked",
      width: 100,
      render: (_, record) =>
        record.is_blocked ? (
          <Tag color="red" icon={<StopOutlined />}>
            {t("users.blockedBadge")}
          </Tag>
        ) : (
          <Tag color="green">{t("users.activeBadge")}</Tag>
        ),
    },
    {
      title: t("users.createdAt"),
      dataIndex: "created_at",
      key: "created_at",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];
};

export default ColumnList;
