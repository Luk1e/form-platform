import React from "react";
import { Input, Select, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchUsers } from "../../../toolkit/admin/adminSlice";
import { setSelectedUserIds } from "../../../toolkit/admin/adminSlice";

const UserFilters = () => {
  const { t } = useTranslation(["admin"]);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleReset = () => {
    const params = {
      page: "1",
      limit: "10",
      search: "",
      is_admin: "",
      is_blocked: "",
    };
    setSearchParams(params);
    dispatch(fetchUsers(params));
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value || "");
    setSearchParams(newParams);
    dispatch(setSelectedUserIds([]));
  };

  return (
    <div className="overflow-x-auto">
      <Space wrap className="mb-4 gap-2">
        <Input
          placeholder={t("users.searchPlaceholder")}
          value={searchParams.get("search") || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          prefix={<SearchOutlined />}
          className="w-40"
        />
        <Select
          placeholder={t("users.adminFilter")}
          value={searchParams.get("is_admin") || undefined}
          onChange={(value) => handleFilterChange("is_admin", value)}
          className="w-32"
          allowClear
          options={[
            { value: "true", label: t("users.adminUsers") },
            { value: "false", label: t("users.regularUsers") },
          ]}
        />
        <Select
          placeholder={t("users.statusFilter")}
          value={searchParams.get("is_blocked") || undefined}
          onChange={(value) => handleFilterChange("is_blocked", value)}
          className="w-32"
          allowClear
          options={[
            { value: "true", label: t("users.blockedUsers") },
            { value: "false", label: t("users.activeUsers") },
          ]}
        />

        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
        >
          {t("users.reset")}
        </Button>
      </Space>
    </div>
  );
};

export default UserFilters;
