import { Card, Radio } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import {
  fetchAdminForms,
  fetchAdminTemplates,
} from "../../../toolkit/admin/adminContentSlice";

import { AdminContentFilters, AdminContentTable } from "./components";

const ContentPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["admin"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeView, setActiveView] = useState("templates");

  const { page, limit, search, order } = Object.fromEntries(searchParams);

  useEffect(() => {
    const params = {
      page: page || "1",
      limit: limit || "10",
      order: order || "desc",
      search: search || "",
    };

    if (activeView === "templates") {
      dispatch(fetchAdminTemplates(params));
    } else {
      dispatch(fetchAdminForms(params));
    }
  }, [dispatch, activeView, page, limit, search, order]);

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen">
      <Card className="shadow-xl rounded-lg">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            {t("adminContentPage.management")}
          </h1>
          <p className="text-sm sm:text-base">
            {t("adminContentPage.managementDesc")}
          </p>
        </div>

        <Radio.Group
          value={activeView}
          onChange={(e) => {
            setActiveView(e.target.value);
            setSearchParams({ page: "1", limit: "10", order: "desc" });
          }}
          className="mb-4"
        >
          <Radio.Button value="templates">
            {t("adminContentPage.templates")}
          </Radio.Button>
          <Radio.Button value="forms">
            {t("adminContentPage.forms")}
          </Radio.Button>
        </Radio.Group>

        <AdminContentFilters activeView={activeView} />
        <AdminContentTable activeView={activeView} />
      </Card>
    </div>
  );
};

export default ContentPage;
