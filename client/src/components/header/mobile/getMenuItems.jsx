import React from "react";
import {
  LogoutOutlined,
  SettingOutlined,
  PlusCircleOutlined,
  LayoutOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Flags from "react-world-flags";

const getMenuItems = ({
  t,
  user,
  theme,
  language,
  closeDrawer,
  logoutMethod,
  toggleLanguage,
  toggleThemeMethod,
}) => {
  const menuItems = [];

  menuItems.push(
    {
      key: "theme",
      icon: (
        <div className="flex items-center justify-center">
          {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
        </div>
      ),
      label: `${theme === "dark" ? t("global.dark") : t("global.light")} ${t(
        "global.theme"
      )}`,
      onClick: toggleThemeMethod,
    },
    {
      key: "language",
      icon: (
        <div className="flex items-center justify-center">
          <Flags
            code={language === "eng" ? "GB" : "GE"}
            style={{ width: "24px", height: "16px" }}
          />
        </div>
      ),
      label: language === "eng" ? "English" : "ქართული",
      onClick: toggleLanguage,
    }
  );

  if (user?.isAdmin) {
    menuItems.push({
      key: "admin",
      icon: <SettingOutlined />,
      label: <Link to="/admin">{t("global.adminPanel")}</Link>,
      onClick: closeDrawer,
    });
  }

  if (user) {
    menuItems.push(
      {
        key: "templates",
        icon: <LayoutOutlined />,
        label: <Link to="/templates">{t("global.templates")}</Link>,
        onClick: closeDrawer,
      },
      {
        key: "create-template",
        icon: <PlusCircleOutlined />,
        label: <Link to="/create-template">{t("global.createTemplate")}</Link>,
        onClick: closeDrawer,
      },

      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: <Link to="/">{t("global.logout")}</Link>,
        onClick: logoutMethod,
        className:
          "border-t !rounded-tl-none !rounded-tr-none",
      }
    );
  }

  return menuItems;
};

export default getMenuItems;
