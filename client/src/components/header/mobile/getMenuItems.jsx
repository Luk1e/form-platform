import {
  LoginOutlined,
  FormOutlined,
  LayoutOutlined,
  UserOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import Flags from "react-world-flags";
import { Link } from "react-router-dom";

const getMenuItems = ({
  t,
  theme,
  language,
  closeDrawer,
  toggleLanguage,
  toggleThemeMethod,
}) => [
  {
    key: "login",
    icon: <LoginOutlined />,
    label: <Link to="/login">{t("global.login")}</Link>,
    onClick: closeDrawer,
  },
  {
    key: "register",
    icon: <FormOutlined />,
    label: <Link to="/register">{t("global.register")}</Link>,
    onClick: closeDrawer,
  },
  {
    icon: (
      <div className="flex items-center justify-center">
        {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
      </div>
    ),
    label: `${theme === "dark" ? t("global.dark") : t("global.light")} ${t(
      "global.theme"
    )}`,
    onClick: toggleThemeMethod,
    className: theme === "dark" ? "!bg-purple-5 !text-white" : "",
  },
  {
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
  },
  {
    key: "templates",
    icon: <LayoutOutlined />,
    label: <Link to="/templates">{t("global.templates")}</Link>,
    onClick: closeDrawer,
  },
  {
    key: "admin",
    icon: <UserOutlined />,
    label: <Link to="/admin">{t("global.adminPanel")}</Link>,
    onClick: closeDrawer,
  },
];

export default getMenuItems;
