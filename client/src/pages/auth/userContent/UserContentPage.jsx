import React, { useEffect, useState } from "react";
import { Card, Spin, Radio } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchUserTemplates,
  fetchUserForms,
} from "../../../toolkit/user/userContentSlice";
import UserContentTable from "./components/UserContentTable";
import UserContentFilters from "./components/UserContentFilters";

const UserContentPage = () => {
  const { t } = useTranslation(["auth"]);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { loading } = useSelector((state) => state.userContent);
  const [activeView, setActiveView] = useState("templates");

  useEffect(() => {
    const params = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      order: searchParams.get("order") || "desc",
    };

    if (activeView === "templates") {
      params.title = searchParams.get("title") || "";
      dispatch(fetchUserTemplates(params));
    } else {
      params.template_title = searchParams.get("template_title") || "";
      dispatch(fetchUserForms(params));
    }
  }, [dispatch, searchParams, activeView]);

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen">
      <Card className="shadow-xl rounded-lg">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            {t("userContentPage.management")}
          </h1>
          <p className="text-sm sm:text-base">
            {t("userContentPage.managementDesc")}
          </p>
        </div>

        {/* View change button */}
        <Radio.Group
          value={activeView}
          onChange={(e) => {
            setActiveView(e.target.value);
            setSearchParams({ page: "1", limit: "10", order: "desc" });
          }}
          className="mb-4"
        >
          <Radio.Button value="templates">
            {t("userContentPage.templates")}
          </Radio.Button>
          <Radio.Button value="forms">
            {t("userContentPage.forms")}
          </Radio.Button>
        </Radio.Group>

        {/* Table filter */}
        <UserContentFilters activeView={activeView} />

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          <UserContentTable activeView={activeView} />
        )}
      </Card>
    </div>
  );
};

export default UserContentPage;
