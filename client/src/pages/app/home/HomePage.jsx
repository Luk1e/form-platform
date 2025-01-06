import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card, Spin, Table, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  getLatestTemplates,
  resetLatestTemplateState,
} from "../../../toolkit/templates/latestTemplateSlice";
import {
  getPopularTemplates,
  resetPopularTemplateState,
} from "../../../toolkit/templates/popularTemplateSlice";
import { getTagCloud, resetTagState } from "../../../toolkit/support/tagSlice";

import { TemplateGallery } from "../../../components";
import { TagCloud, PopularTemplateColumns } from "./components";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["app"]);

  const { tagCloud, loading: loadingTagCloud } = useSelector(
    (state) => state.supportTags
  );

  const { popularTemplates, loading: loadingPopularTemplates } = useSelector(
    (state) => state.popularTemplates
  );

  const {
    latestTemplates,
    pagination,
    loading: loadingLatestTemplates,
  } = useSelector((state) => state.latestTemplates);

  useEffect(() => {
    dispatch(getTagCloud());
    dispatch(getPopularTemplates());
    dispatch(getLatestTemplates({ page: 1, limit: 10 }));

    return () => {
      dispatch(resetTagState());
      dispatch(resetLatestTemplateState());
      dispatch(resetPopularTemplateState());
    };
  }, [dispatch]);

  const handleTagClick = (tagId) => {
    navigate(`/search?tag=${tagId}`);
  };

  const handleLoadMore = () => {
    if (pagination.currentPage < pagination.totalPages) {
      dispatch(
        getLatestTemplates({ page: pagination.currentPage + 1, limit: 10 })
      );
    }
  };

  const popularTemplateColumns = PopularTemplateColumns();

  if (
    loadingTagCloud ||
    (loadingLatestTemplates && latestTemplates.length === 0) ||
    loadingPopularTemplates
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Tag Cloud */}
      <section>
        <Card
          title={t("homePage.exploreByTags")}
          className="shadow-md [&_.ant-card-head-title]:sm:text-2xl"
        >
          <TagCloud tags={tagCloud} onTagClick={handleTagClick} />
        </Card>
      </section>

      {/* Popular Templates Table */}
      <section>
        <Card
          title={t("homePage.popularTemplates")}
          className="shadow-md [&_.ant-card-head-title]:sm:text-2xl"
        >
          <Table
            columns={popularTemplateColumns}
            dataSource={popularTemplates}
            pagination={false}
            rowKey="id"
            className="overflow-x-auto"
          />
        </Card>
      </section>

      {/* Latest Templates Gallery */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          {t("homePage.latestTemplates")}
        </h2>
        <TemplateGallery templates={latestTemplates} />
      </section>

      {pagination.currentPage < pagination.totalPages && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            loading={loadingLatestTemplates}
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

export default HomePage;
