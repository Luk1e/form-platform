import { Table } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import ColumnList from "./ColumnList";

function FormTable() {
  const { t } = useTranslation(["auth"]);
  const [searchParams, setSearchParams] = useSearchParams();

  const { page, limit } = Object.fromEntries(searchParams);
  const { forms, template, loading, pagination } = useSelector(
    (state) => state.templateForms
  );

  const columnList = ColumnList(template);

  const handleTableChange = (pagination) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pagination.current.toString());
    newParams.set("limit", pagination.pageSize.toString());
    setSearchParams(newParams);
  };

  return (
    <Table
      columns={columnList}
      dataSource={forms}
      loading={loading}
      rowKey="id"
      pagination={{
        current: parseInt(page || "1"),
        pageSize: parseInt(limit || "10"),
        total: pagination.total,
        showSizeChanger: true,
        showTotal: (total) =>
          t("templateFormPage.filters.totalItems", { total }),
      }}
      onChange={handleTableChange}
      scroll={{ x: "max-content" }}
      size="middle"
    />
  );
}

export default FormTable;
