import { Dropdown, Avatar, App } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";
import { useCallback } from "react";

import getMenuItems from "./getMenuItems";
import { logout } from "../../../toolkit/auth/authSlice";

function DropDownComponent({ isMenuVisible, setIsMenuVisible }) {
  const { t } = useTranslation(["components"]);
  const { user } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const { notification } = App.useApp();

  const logoutMethod = useCallback(() => {
    dispatch(logout());
    notification.success({
      message: t("notifications.logoutSuccess"),
      description: t("notifications.goodBye"),
      className: `
        !bg-purple-1 dark:!bg-purple-8 
        [&_.ant-notification-notice-message]:!text-purple-9 
        [&_.ant-notification-notice-message]:dark:!text-purple-2
        [&_.ant-notification-notice-description]:!text-purple-7
        [&_.ant-notification-notice-description]:dark:!text-purple-3
        [&_.ant-notification-notice-icon]:!text-purple-6 
        [&_.ant-notification-notice-icon]:dark:!text-purple-3
        [&_.ant-notification-notice-close]:!text-purple-6
        [&_.ant-notification-notice-close]:dark:!text-purple-3
        [&_.ant-notification-notice-close]:hover:!text-purple-8
        [&_.ant-notification-notice-close]:dark:hover:!text-purple-1
        !border-purple-3 dark:!border-purple-7
      `,
    });
  }, [dispatch, notification, t]);

  const menuItems = getMenuItems(t, user, logoutMethod);

  return (
    <Dropdown
      menu={{
        items: menuItems,
        className: "w-48",
      }}
      placement="bottom"
      trigger={["click"]}
      onOpenChange={setIsMenuVisible}
    >
      <Avatar
        icon={<UserOutlined />}
        className={`
          cursor-pointer 
          transition-colors 
          duration-300
          ${
            isMenuVisible
              ? "bg-purple-5 dark:bg-purple-5 hover:bg-purple-4 dark:hover:bg-purple-6"
              : "bg-purple-4 dark:bg-purple-6 hover:bg-purple-5 dark:hover:bg-purple-5"
          }
        `}
      />
    </Dropdown>
  );
}

export default DropDownComponent;
