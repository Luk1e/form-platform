import { App } from "antd";
import {
  LoginOutlined,
  FormOutlined,
  LogoutOutlined,
  SettingOutlined,
  LayoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../../toolkit/auth/authSlice";

const UserDropdownList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["components"]);
  const { user } = useSelector((state) => state.authentication);
  const { notification } = App.useApp();

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

  if (user?.isAdmin) {
    dropdownList.push({
      key: "admin",
      icon: <SettingOutlined />,
      label: <Link to="/admin">{t("global.adminPanel")}</Link>,
    });
  }

  if (user) {
    dropdownList.push(
      {
        key: "my-content",
        icon: <LayoutOutlined />,
        label: <Link to="/my-content">{t("global.myContent")}</Link>,
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: <Link to="/">{t("global.logout")}</Link>,
        onClick: logoutMethod,
        className: "border-t !rounded-tl-none !rounded-tr-none mt-2 pt-2",
      }
    );
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
