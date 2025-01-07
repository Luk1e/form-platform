import debounce from "lodash/debounce";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Input, Select, Space, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

import { setSelectedUserIds } from "../../../../toolkit/admin/adminUserSlice";

const UserFilters = () => {
  const debouncedRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation(["admin"]);
  const { selectedUserIds } = useSelector((state) => state.adminUsers);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

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
    debouncedRef.current(value);
  };

  const handleReset = () => {
    setSearchValue("");
    setSearchParams({});
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
  };

  const handleRemoveSelected = () => {
    dispatch(setSelectedUserIds([]));
  };

  return (
    <div className="overflow-x-auto">
      <Space wrap className="mb-4 gap-2">
        {/* Search input */}
        <Input
          placeholder={t("users.searchPlaceholder")}
          value={searchValue}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          className="w-40"
        />

        {/* Admin status filter */}
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

        {/* Blocked status filter */}
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

        {/* Clear selected */}
        {selectedUserIds.length > 0 && (
          <Button onClick={handleRemoveSelected}>
            {t("users.clearSelected")} ({selectedUserIds.length})
          </Button>
        )}

        {/* Reset filters */}
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          {t("users.reset")}
        </Button>
      </Space>
    </div>
  );
};

export default UserFilters;
