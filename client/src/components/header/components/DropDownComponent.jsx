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
          duration-300`}
      />
    </Dropdown>
  );
}

export default DropDownComponent;
