import React, { useEffect } from "react";
import { Card, Spin } from "antd";
import { useTranslation } from "react-i18next";
import UsersTable from "./components/UsersTable";
import UserFilters from "./components/UserFilters";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchUsers } from "../../toolkit/admin/adminSlice";

const UsersPage = () => {
  const { t } = useTranslation(["admin"]);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      search: searchParams.get("search") || "",
      is_admin: searchParams.get("is_admin") || "",
      is_blocked: searchParams.get("is_blocked") || "",
    };
    dispatch(fetchUsers(params));
  }, [dispatch, searchParams]);

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen">
      <Card className="shadow-xl rounded-lg">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            {t("users.usersManagement")}
          </h1>
          <p className="text-sm sm:text-base">
            {t("users.usersManagementDesc")}
          </p>
        </div>
        <UserFilters />
        <UsersTable />
      </Card>
    </div>
  );
};

export default UsersPage;
