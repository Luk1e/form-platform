import { Input, Select, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { setSelectedUserIds } from "../../../toolkit/admin/adminSlice";
import { useState, useRef, useEffect } from "react";
import debounce from "lodash/debounce";

const UserFilters = () => {
  const { t } = useTranslation(["admin"]);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const debouncedRef = useRef();

  useEffect(() => {
    debouncedRef.current = debounce((value) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (value) {
          newParams.set("search", value);
        } else {
          newParams.delete("search");
        }
        newParams.set("page", "1");
        return newParams;
      });
    }, 300);

    return () => {
      debouncedRef.current?.cancel();
    };
  }, [setSearchParams]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    dispatch(setSelectedUserIds([]));

    debouncedRef.current(value);
  };

  const handleReset = () => {
    setSearchValue("");
    setSearchParams({});
    dispatch(setSelectedUserIds([]));
  };

  const handleFilterChange = (key, value) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      newParams.set("page", "1");
      return newParams;
    });
    dispatch(setSelectedUserIds([]));
  };

  return (
    <div className="overflow-x-auto">
      <Space wrap className="mb-4 gap-2">
        <Input
          placeholder={t("users.searchPlaceholder")}
          value={searchValue}
          onChange={handleSearch}
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

        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          {t("users.reset")}
        </Button>
      </Space>
    </div>
  );
};

export default UserFilters;
