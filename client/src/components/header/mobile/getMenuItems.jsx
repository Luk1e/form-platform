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
          {theme === "dark" ? (
            <MoonOutlined className="text-purple-6" />
          ) : (
            <SunOutlined className="text-purple-6" />
          )}
        </div>
      ),
      label: `${theme === "dark" ? t("global.dark") : t("global.light")} ${t(
        "global.theme"
      )}`,
      onClick: toggleThemeMethod,
      className: theme === "dark" ? "!bg-purple-5 !text-white" : "",
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
      icon: <SettingOutlined className="!text-purple-6" />,
      label: (
        <Link
          to="/admin"
          className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
        >
          {t("global.adminPanel")}
        </Link>
      ),
      onClick: closeDrawer,
    });
  }

  if (user) {
    menuItems.push(
      {
        key: "templates",
        icon: <LayoutOutlined className="!text-purple-6" />,
        label: (
          <Link
            to="/templates"
            className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
          >
            {t("global.templates")}
          </Link>
        ),
        onClick: closeDrawer,
      },
      {
        key: "create-template",
        icon: <PlusCircleOutlined className="!text-purple-6" />,
        label: (
          <Link
            to="/create-template"
            className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
          >
            {t("global.createTemplate")}
          </Link>
        ),
        onClick: closeDrawer,
      },

      {
        key: "logout",
        icon: <LogoutOutlined className="!text-purple-6" />,
        label: (
          <Link
            to="/"
            className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
          >
            {t("global.logout")}
          </Link>
        ),
        onClick: logoutMethod,
        className:
          "border-t !rounded-tl-none !rounded-tr-none border-purple-3 dark:border-purple-7",
      }
    );
  }

  return menuItems;
};

export default getMenuItems;
