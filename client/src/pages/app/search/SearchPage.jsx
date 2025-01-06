import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, Spin, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  searchTemplates,
  resetSearchState,
} from "../../../toolkit/templates/searchTemplateSlice";

import { TemplateGallery } from "../../../components";

const SearchPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(["app"]);

  const { templates, pagination, loading, error } = useSelector(
    (state) => state.searchTemplates
  );

  const tag = searchParams.get("tag") || "";
  const query = searchParams.get("query") || "";

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(
        searchTemplates({
          tag: tag,
          query: query,
          page: pagination.currentPage + 1,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(searchTemplates({ tag, query, page: 1 }));

    return () => {
      dispatch(resetSearchState());
    };
  }, [dispatch, query, tag]);

  if (loading && templates.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Card className="text-center">
          <p className="text-red-500">{t("search.error")}</p>
        </Card>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="p-4 md:p-6">
        <Card className="flex flex-col text-center items-center justify-center p-8">
          <InboxOutlined className="text-4xl text-gray-400 mb-2" />
          <p className="text-gray-600">{t("search.noResults")}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("search.templates")}</h1>
        <span className="text-gray-500">
          {t("search.totalResults", { count: pagination.totalTemplates })}
        </span>
      </div>

      <TemplateGallery templates={templates} />

      {pagination.currentPage < pagination.totalPages && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            loading={loading}
            size="large"
            type="primary"
          >
            {t("global.loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
