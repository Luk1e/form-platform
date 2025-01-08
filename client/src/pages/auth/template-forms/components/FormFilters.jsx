import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Input, Select, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

function FormFilters() {
  const { t } = useTranslation(["auth"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const debouncedRef = useRef();

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
    <div className="mb-4">
      <Space wrap className="gap-2">
        <Input
          placeholder={t("templateFormPage.filters.searchPlaceholder")}
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={handleSearch}
          className="w-64"
        />
        <Select
          value={searchParams.get("order") || "desc"}
          onChange={(value) => handleFilterChange("order", value)}
          className="w-32"
          options={[
            {
              value: "desc",
              label: t("templateFormPage.filters.orderOptions.newest"),
            },
            {
              value: "asc",
              label: t("templateFormPage.filters.orderOptions.oldest"),
            },
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          {t("templateFormPage.filters.resetButton")}
        </Button>
      </Space>
    </div>
  );
}

export default FormFilters;
