import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Input, Button, Space, Select } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const AdminContentFilters = ({ activeView }) => {
  const { t } = useTranslation(["admin"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const debouncedRef = useRef();

  useEffect(() => {
    setSearchValue("");
  }, [activeView]);

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    setSearchValue(urlSearch || "");
  }, [searchParams]);

  useEffect(() => {
    debouncedRef.current = debounce((value) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("search", value || "");
      newParams.set("page", "1");
      setSearchParams(newParams);
    }, 300);

    return () => {
      debouncedRef.current?.cancel();
    };
  }, [setSearchParams, searchParams]);

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

  return (
    <div className="overflow-x-auto">
      <Space wrap className="mb-4 gap-2">
        {/* Search input */}
        <Input
          placeholder={t(
            `adminContentPage.search${
              activeView === "templates" ? "Templates" : "Forms"
            }Placeholder`
          )}
          value={searchValue}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          className="w-40"
        />

        {/* Order filter */}
        <Select
          value={searchParams.get("order") || "desc"}
          onChange={(value) => {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("order", value);
            newParams.set("page", "1");
            setSearchParams(newParams);
          }}
          className="w-32"
          options={[
            { value: "desc", label: t("adminContentPage.newest") },
            { value: "asc", label: t("adminContentPage.oldest") },
          ]}
        />

        {/* Reset filter */}
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          {t("adminContentPage.reset")}
        </Button>
      </Space>
    </div>
  );
};

export default AdminContentFilters;
