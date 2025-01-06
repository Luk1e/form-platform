import { App } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  LayoutOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import Flags from "react-world-flags";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../../toolkit/auth/authSlice";
import { toggleTheme } from "../../../toolkit/theme/themeSlice";

const MenuDropdownList = (user, closeDrawer) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const { t, i18n } = useTranslation(["components"]);
  const themeMode = useSelector((state) => state.theme.mode);

  const language = i18n.language;

  const toggleThemeMethod = () => {
    dispatch(toggleTheme());
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "eng" ? "geo" : "eng");
  };

  const logoutMethod = () => {
    dispatch(logout()).then(() => {
      navigate("/");
      notification.success({
        message: t("notifications.logoutSuccess"),
        description: t("notifications.goodBye"),
      });
      closeDrawer();
    });
  };

  const dropdownList = [];

  dropdownList.push(
    {
      key: "theme",
      icon: (
        <div className="flex items-center justify-center">
          {themeMode === "dark" ? <MoonOutlined /> : <SunOutlined />}
        </div>
      ),
      label: `${
        themeMode === "dark" ? t("global.dark") : t("global.light")
      } ${t("global.theme")}`,
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
    dropdownList.push({
      key: "admin",
      icon: <SettingOutlined />,
      label: <Link to="/admin">{t("global.adminPanel")}</Link>,
      onClick: closeDrawer,
    });
  }

  if (user) {
    dropdownList.push(
      {
        key: "my-content",
        icon: <LayoutOutlined />,
        label: <Link to="/my-content">{t("global.myContent")}</Link>,
        onClick: closeDrawer,
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: <Link to="/">{t("global.logout")}</Link>,
        onClick: logoutMethod,
        className: "border-t !rounded-tl-none !rounded-tr-none",
      }
    );
  }

  return dropdownList;
};

export default MenuDropdownList;
