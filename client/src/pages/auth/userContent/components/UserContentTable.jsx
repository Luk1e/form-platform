import React from "react";
import { Table, App } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchUserForms,
  fetchUserTemplates,
  deleteTemplate,
} from "../../../../toolkit/user/userContentSlice";
import { getFormColumns, getTemplateColumns } from "./getColumns";

const UserContentTable = ({ activeView }) => {
  const { t } = useTranslation(["auth"]);
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const { templates, loading, forms, pagination } = useSelector(
    (state) => state.userContent
  );

  const handleTableChange = (pagination) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pagination.current.toString());
    newParams.set("limit", pagination.pageSize.toString());
    setSearchParams(newParams);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTemplate(id)).unwrap();
      notification.success({
        message: t("notifications.templateDeleteSuccess"),
      });
      const params = {
        page: searchParams.get("page") || "1",
        limit: searchParams.get("limit") || "10",
        order: searchParams.get("order") || "desc",
        title: searchParams.get("title") || "",
      };

      dispatch(fetchUserTemplates(params));
    } catch (error) {
      notification.error({
        message: t(`errors.${error.errorCode}`),
      });
    }
  };

  const formColumns = getFormColumns(t);
  const templateColumns = getTemplateColumns(t, handleDelete);

  const data = activeView === "templates" ? templates : forms;
  const columns = activeView === "templates" ? templateColumns : formColumns;

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        current: parseInt(searchParams.get("page") || "1"),
        pageSize: parseInt(searchParams.get("limit") || "10"),
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total) => t("userContentPage.total") + ": " + total,
      }}
      onChange={handleTableChange}
      scroll={{ x: 800 }}
    />
  );
};

export default UserContentTable;
