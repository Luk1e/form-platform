import { Link } from "react-router-dom";
import {
  LoginOutlined,
  FormOutlined,
  LogoutOutlined,
  SettingOutlined,
  PlusCircleOutlined,
  LayoutOutlined,
} from "@ant-design/icons";

const getMenuItems = (t, user, logoutMethod) => {
  const menuItems = [];

  if (user?.isAdmin) {
    menuItems.push({
      key: "admin",
      icon: <SettingOutlined />,
      label: <Link to="/admin">{t("global.adminPanel")}</Link>,
    });
  }

  if (user) {
    menuItems.push(
      {
        key: "templates",
        icon: <LayoutOutlined />,
        label: <Link to="/templates">{t("global.templates")}</Link>,
      },
      {
        key: "templates/create",
        icon: <PlusCircleOutlined />,
        label: <Link to="/templates/create">{t("global.createTemplate")}</Link>,
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
    menuItems.push(
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

  return menuItems;
};

export default getMenuItems;
