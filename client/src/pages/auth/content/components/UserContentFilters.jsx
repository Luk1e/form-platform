import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Input, Button, Space, Select } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const UserContentFilters = ({ activeView }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(["auth"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("title") || ""
  );

  const debouncedRef = useRef();

  useEffect(() => {
    setSearchValue("");
  }, [activeView]);

  useEffect(() => {
    const urlSearch = searchParams.get("title");
    setSearchValue(urlSearch || "");
  }, [searchParams]);

  useEffect(() => {
    debouncedRef.current = debounce((value) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("title", value || "");
      newParams.set("page", "1");
      setSearchParams(newParams);
    }, 300);

    return () => {
      debouncedRef.current?.cancel();
    };
  }, [setSearchParams, searchParams, activeView]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedRef.current(value);
  };

  const handleReset = () => {
    setSearchValue("");
    const newParams = new URLSearchParams();
    newParams.set("view", searchParams.get("view") || "templates");
    newParams.set("page", "1");
    newParams.set("limit", "10");
    newParams.set("order", "desc");
    setSearchParams(newParams);
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
          value={searchValue}
          onChange={handleSearch}
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
