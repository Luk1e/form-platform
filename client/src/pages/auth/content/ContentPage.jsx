import { Card, Radio, Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloudOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTemplates,
  fetchUserForms,
} from "../../../toolkit/user/userContentSlice";
import { SalesforceForm } from "../../../components";
import { UserContentTable, UserContentFilters } from "./components";
import { getSalesforceAccount } from "../../../toolkit/salesforce/accountSlice";

const ContentPage = () => {
  const dispatch = useDispatch();
  const { accountDetails } = useSelector((state) => state.salesforceAccount);
  const { t } = useTranslation(["auth"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit, order, title, view } = Object.fromEntries(searchParams);
  const [activeView, setActiveView] = useState(view || "templates");
  const [isSalesforceModalOpen, setIsSalesforceModalOpen] = useState(false);

  useEffect(() => {
    if (!view) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("view", activeView);
      setSearchParams(newParams);
    }
    dispatch(getSalesforceAccount());
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
      title: title || "",
      limit: limit || "10",
      order: order || "desc",
    };

    if (activeView === "templates") {
      dispatch(fetchUserTemplates(params));
    } else {
      dispatch(fetchUserForms(params));
    }
  }, [dispatch, activeView, page, title, limit, order]);

  const handleViewChange = (e) => {
    const newView = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", newView);
    newParams.set("page", "1");
    newParams.set("title", "");
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
            {t("userContentPage.management")}
          </h1>
          <p className="text-sm sm:text-base">
            {t("userContentPage.managementDesc")}
          </p>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
          {/* View change button */}
          <Radio.Group value={activeView} onChange={handleViewChange}>
            <Radio.Button value="templates">
              {t("userContentPage.templates")}
            </Radio.Button>
            <Radio.Button value="forms">
              {t("userContentPage.forms")}
            </Radio.Button>
          </Radio.Group>

          {/* Salesforce modal button */}
          {!accountDetails?.salesforce_account_id && (
            <Button
              type="primary"
              onClick={() => setIsSalesforceModalOpen(true)}
              icon={<CloudOutlined />}
            >
              {t("userContentPage.syncWithSalesforce")}
            </Button>
          )}
        </div>

        {/* Table filter */}
        <UserContentFilters activeView={activeView} />

        {/* Table */}
        <UserContentTable activeView={activeView} />

        {/* Salesforce modal */}
        <SalesforceForm
          isOpen={isSalesforceModalOpen}
          onClose={() => setIsSalesforceModalOpen(false)}
        />
      </Card>
    </div>
  );
};

export default ContentPage;
