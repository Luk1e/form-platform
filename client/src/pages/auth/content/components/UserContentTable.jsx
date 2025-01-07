import { Table, App } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import { fetchUserTemplates } from "../../../../toolkit/user/userContentSlice";
import { deleteTemplate } from "../../../../toolkit/templates/deleteTemplateSlice";

import { FormColumns, TemplateColumns } from "./ColumnList";

const UserContentTable = ({ activeView }) => {
  const { t } = useTranslation(["auth"]);
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, limit, order, title } = Object.fromEntries(searchParams);
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
        page: page || "1",
        limit: limit || "10",
        order: order || "desc",
        title: title || "",
      };

      dispatch(fetchUserTemplates(params));
    } catch (error) {
      notification.error({
        message: t(`errors.${error.errorCode}`),
      });
    }
  };

  const formColumns = FormColumns();
  const templateColumns = TemplateColumns(handleDelete);

  const data = activeView === "templates" ? templates : forms;
  const columns = activeView === "templates" ? templateColumns : formColumns;

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        current: parseInt(page || "1"),
        pageSize: parseInt(limit || "10"),
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
