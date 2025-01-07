import { App } from "antd";
import {
  FormOutlined,
  LoginOutlined,
  LogoutOutlined,
  LayoutOutlined,
  UserAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../../toolkit/auth/authSlice";

const UserDropdownList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { t } = useTranslation(["components"]);
  const { user } = useSelector((state) => state.authentication);

  const logoutMethod = () => {
    dispatch(logout()).then(() => {
      navigate("/");
      notification.success({
        message: t("notifications.logoutSuccess"),
        description: t("notifications.goodBye"),
      });
    });
  };

  const dropdownList = [];

  if (user) {
    dropdownList.push({
      key: "my-content",
      icon: <LayoutOutlined />,
      label: <Link to="/my-content">{t("global.myContent")}</Link>,
    });

    if (user?.isAdmin) {
      dropdownList.push(
        {
          key: "manage-users",
          icon: <UserAddOutlined />,
          label: <Link to="/admin/users">{t("global.manageUsers")}</Link>,
        },
        {
          key: "manage-contents",
          icon: <SettingOutlined />,
          label: <Link to="/admin/contents">{t("global.manageContents")}</Link>,
        }
      );
    }

    dropdownList.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: <Link to="/">{t("global.logout")}</Link>,
      onClick: logoutMethod,
      className: "border-t !rounded-tl-none !rounded-tr-none mt-2 pt-2",
    });
  } else {
    dropdownList.push(
      {
        key: "login",
        icon: <LoginOutlined />,
        label: <Link to="/login">{t("global.login")}</Link>,
      },
      {
        key: "register",
        icon: <FormOutlined />,
        label: <Link to="/register">{t("global.register")}</Link>,
      }
    );
  }

  return dropdownList;
};

export default UserDropdownList;
