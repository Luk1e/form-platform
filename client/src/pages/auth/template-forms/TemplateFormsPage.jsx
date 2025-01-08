import { Card } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { FormFilters, FormTable } from "./components";
import {
  fetchTemplateForms,
  resetTemplateFormState,
} from "../../../toolkit/templates/templateFormSlice";

const TemplateFormsPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["auth"]);
  const { id: templateId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit, order, search } = Object.fromEntries(searchParams);

  useEffect(() => {
    dispatch(
      fetchTemplateForms({
        templateId,
        page: page || "1",
        limit: limit || "10",
        search: search || "",
        order: order || "desc",
      })
    );
  }, [dispatch, templateId, page, limit, order, search]);

  useEffect(() => {
    return () => {
      dispatch(resetTemplateFormState());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4 min-h-screen">
      <Card className="shadow-lg rounded-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {t("templateFormPage.pageTitle")}
          </h1>
          <p className="text-gray-600">
            {t("templateFormPage.pageDescription")}
          </p>
        </div>

        <FormFilters />
        <FormTable />
      </Card>
    </div>
  );
};

export default TemplateFormsPage;
