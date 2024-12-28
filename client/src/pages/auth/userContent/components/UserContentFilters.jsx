import React from "react";
import { Input, Button, Space, Select } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";

const UserContentFilters = ({ activeView }) => {
  const { t } = useTranslation(["auth"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleReset = () => {
    setSearchParams({
      page: "1",
      limit: "10",
      order: "desc",
    });
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value || "");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="overflow-x-auto">
      <Space wrap className="mb-4 gap-2">
        <Input
          placeholder={t(
            `userContentPage.search${
              activeView.charAt(0).toUpperCase() +
              activeView.slice(1).toLowerCase()
            }Placeholder`
          )}
          value={
            searchParams.get(
              activeView === "templates" ? "title" : "template_title"
            ) || ""
          }
          onChange={(e) =>
            handleFilterChange(
              activeView === "templates" ? "title" : "template_title",
              e.target.value
            )
          }
          prefix={<SearchOutlined />}
          className="w-40"
        />
        <Select
          value={searchParams.get("order") || "desc"}
          onChange={(value) => handleFilterChange("order", value)}
          className="w-32"
          options={[
            { value: "desc", label: t("userContentPage.newest") },
            { value: "asc", label: t("userContentPage.oldest") },
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          {t("userContentPage.reset")}
        </Button>
        {activeView === "templates" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/templates/create")}
          >
            {t("userContentPage.createTemplate")}
          </Button>
        )}
      </Space>
    </div>
  );
};

export default UserContentFilters;
