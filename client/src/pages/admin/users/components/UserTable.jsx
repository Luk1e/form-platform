import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  LockOutlined,
  UnlockOutlined,
  CrownOutlined,
  DeleteOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Table, Space, Button, Popconfirm, App } from "antd";

import {
  fetchUsers,
  setSelectedUserIds,
  bulkBlockUsers,
  bulkUnblockUsers,
  bulkAddAdminPrivileges,
  bulkRemoveAdminPrivileges,
  bulkDeleteUsers,
} from "../../../../toolkit/admin/adminUserSlice";

import ColumnList from "./ColumnList";

const UserTable = () => {
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const { t } = useTranslation(["admin"]);
  const [searchParams, setSearchParams] = useSearchParams();

  const { users, pagination, loading, selectedUserIds } = useSelector(
    (state) => state.adminUsers
  );

  const { page, limit, search, is_admin, is_blocked } =
    Object.fromEntries(searchParams);

  const handleTableChange = (pagination) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pagination.current.toString());
    newParams.set("limit", pagination.pageSize.toString());
    setSearchParams(newParams);
  };

  const handleBulkAction = async (action, actionName) => {
    try {
      await dispatch(action(selectedUserIds)).unwrap();
      notification.success({
        message: t(`notifications.${actionName}Success`),
      });
      dispatch(fetchUsers({ page, limit, search, is_admin, is_blocked }));
    } catch (error) {
      notification.error({
        message: t(`errors.${error.errorCode}`),
      });
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedUserIds,
    onChange: (selectedRowKeys) => {
      dispatch(setSelectedUserIds(selectedRowKeys));
    },
  };

  const columnList = ColumnList();

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <Space wrap className="mb-4 flex flex-wrap gap-2">
          {/* Block users button */}
          <Popconfirm
            title={t("users.blockConfirm")}
            onConfirm={() => handleBulkAction(bulkBlockUsers, "blockUsers")}
            disabled={selectedUserIds.length === 0}
          >
            <Button
              icon={<LockOutlined />}
              disabled={selectedUserIds.length === 0}
            >
              {t("users.blockUsers")}
            </Button>
          </Popconfirm>

          {/* Unblock users button */}
          <Button
            icon={<UnlockOutlined />}
            onClick={() => handleBulkAction(bulkUnblockUsers, "unblockUsers")}
            disabled={selectedUserIds.length === 0}
          >
            {t("users.unblockUsers")}
          </Button>
          <Button
            icon={<CrownOutlined />}
            onClick={() =>
              handleBulkAction(bulkAddAdminPrivileges, "addAdminPrivileges")
            }
            disabled={selectedUserIds.length === 0}
          >
            {t("users.makeAdmin")}
          </Button>

          {/* Remove admin button */}
          <Button
            icon={<StopOutlined />}
            onClick={() =>
              handleBulkAction(
                bulkRemoveAdminPrivileges,
                "removeAdminPrivileges"
              )
            }
            disabled={selectedUserIds.length === 0}
          >
            {t("users.removeAdmin")}
          </Button>

          {/* Delete user button */}
          <Popconfirm
            title={t("users.deleteConfirm")}
            onConfirm={() => handleBulkAction(bulkDeleteUsers, "deleteUsers")}
            disabled={selectedUserIds.length === 0}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedUserIds.length === 0}
            >
              {t("users.deleteUsers")}
            </Button>
          </Popconfirm>
        </Space>

        <Table
          rowSelection={rowSelection}
          columns={columnList}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            current: parseInt(page || "1"),
            pageSize: parseInt(limit || "10"),
            total: pagination.totalUsers,
            showSizeChanger: true,
            showTotal: (total) => t("users.totalUsers") + ": " + total,
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
};

export default UserTable;
