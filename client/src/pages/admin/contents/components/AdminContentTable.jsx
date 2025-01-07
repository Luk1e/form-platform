import { Table } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { FormColumns, TemplateColumns } from "./ColumnList";

const AdminContentTable = ({ activeView }) => {
  const { t } = useTranslation(["admin"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { templates, forms, loading, pagination } = useSelector(
    (state) => state.adminContent
  );

  const handleTableChange = (pagination) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pagination.current.toString());
    newParams.set("limit", pagination.pageSize.toString());
    setSearchParams(newParams);
  };

  const formColumns = FormColumns();
  const templateColumns = TemplateColumns();

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
        showTotal: (total) => t("adminContentPage.total") + ": " + total,
      }}
      onChange={handleTableChange}
      scroll={{ x: 800 }}
    />
  );
};

export default AdminContentTable;
