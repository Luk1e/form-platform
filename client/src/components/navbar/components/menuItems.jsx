import {
  UserOutlined,
  LayoutOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";

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
        {theme === "light" ? <MoonOutlined /> : <SunOutlined />}
      </div>
    ),
    title: `${theme === "light" ? t("global.dark") : t("global.light")} ${t(
      "global.theme"
    )}`,
    onClick: toggleThemeMethod,
    className: theme === "light" ? "bg-purple-5 text-white" : "",
  },
  {
    icon: (
      <div className="flex items-center justify-center text-lg">
        {language === "eng" ? "🇬🇪" : "🇬🇧"}
      </div>
    ),
    title: language === "eng" ? "ქართული" : "English",
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
