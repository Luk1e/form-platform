import {
  UserOutlined,
  LayoutOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import Flags from "react-world-flags";

const getMenuItems = ({
  t,
  theme,
  language,
  navigate,
  toggleLanguage,
  toggleThemeMethod,
}) => [
  {
    icon: (
      <div className="flex items-center justify-center">
        {theme === "dark" ? <MoonOutlined /> : <SunOutlined />}
      </div>
    ),
    title: `${theme === "dark" ? t("global.dark") : t("global.light")} ${t(
      "global.theme"
    )}`,
    onClick: toggleThemeMethod,
    className: theme === "dark" ? "bg-purple-5 text-white" : "",
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
    title: language === "eng" ? "English" : "ქართული",
    onClick: toggleLanguage,
  },
  {
    icon: <LayoutOutlined />,
    title: t("global.templates"),
    onClick: () => navigate("/templates"),
  },
  {
    icon: <UserOutlined />,
    title: t("global.adminPanel"),
    onClick: () => navigate("/admin"),
  },
];

export default getMenuItems;
