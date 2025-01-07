import { Card } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { fetchUsers } from "../../toolkit/admin/adminUserSlice";

import { UsersTable, UserFilters } from "./components";

const UsersPage = () => {
  const { t } = useTranslation(["admin"]);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { page, limit, search, is_admin, is_blocked } =
    Object.fromEntries(searchParams);

  useEffect(() => {
    const params = {
      page: page || "1",
      limit: limit || "10",
      search: search || "",
      is_admin: is_admin || "",
      is_blocked: is_blocked || "",
    };
    dispatch(fetchUsers(params));
  }, [dispatch, page, limit, search, is_admin, is_blocked]);

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
