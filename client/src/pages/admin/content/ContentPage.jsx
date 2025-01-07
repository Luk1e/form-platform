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
  const { page, limit, search, order, view } = Object.fromEntries(searchParams);
  const [activeView, setActiveView] = useState(view || "templates");

  useEffect(() => {
    if (!view) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("view", activeView);
      setSearchParams(newParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const urlView = searchParams.get("view");
    if (urlView && urlView !== activeView) {
      setActiveView(urlView);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleViewChange = (e) => {
    const newView = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", newView);
    newParams.set("page", "1");
    newParams.set("search", "");
    newParams.set("limit", "10");
    newParams.set("order", "desc");
    setSearchParams(newParams);
    setActiveView(newView);
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen">
      <Card className="shadow-xl rounded-lg">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            {t("adminContentPage.management")}
          </h1>
          <p className="text-sm sm:text-base">
            {t("adminContentPage.managementDesc")}
          </p>
        </div>

        {/* View change button */}
        <Radio.Group
          value={activeView}
          onChange={handleViewChange}
          className="mb-4"
        >
          <Radio.Button value="templates">
            {t("adminContentPage.templates")}
          </Radio.Button>
          <Radio.Button value="forms">
            {t("adminContentPage.forms")}
          </Radio.Button>
        </Radio.Group>

        {/* Table filter */}
        <AdminContentFilters activeView={activeView} />

        {/* Table */}
        <AdminContentTable activeView={activeView} />
      </Card>
    </div>
  );
};

export default ContentPage;
