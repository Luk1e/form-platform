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
      icon: <SettingOutlined className="text-purple-6" />,
      label: (
        <Link
          to="/admin"
          className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
        >
          {t("global.adminPanel")}
        </Link>
      ),
    });
  }

  if (user) {
    menuItems.push(
      {
        key: "templates",
        icon: <LayoutOutlined className="text-purple-6" />,
        label: (
          <Link
            to="/templates"
            className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
          >
            {t("global.templates")}
          </Link>
        ),
      },
      {
        key: "create-template",
        icon: <PlusCircleOutlined className="text-purple-6" />,
        label: (
          <Link
            to="/create-template"
            className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
          >
            {t("global.createTemplate")}
          </Link>
        ),
      },

      {
        key: "logout",
        icon: <LogoutOutlined className="text-purple-6" />,
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
          "border-t !rounded-tl-none !rounded-tr-none border-purple-3 dark:border-purple-7 mt-2 pt-2",
      }
    );
  } else {
    menuItems.push(
      {
        key: "login",
        icon: <LoginOutlined className="text-purple-6" />,
        label: (
          <Link
            to="/login"
            className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
          >
            {t("global.login")}
          </Link>
        ),
      },
      {
        key: "register",
        icon: <FormOutlined className="text-purple-6" />,
        label: (
          <Link
            to="/register"
            className="!text-purple-9 dark:!text-purple-6 hover:!text-purple-7 dark:hover:!text-purple-2"
          >
            {t("global.register")}
          </Link>
        ),
      }
    );
  }

  return menuItems;
};

export default getMenuItems;
