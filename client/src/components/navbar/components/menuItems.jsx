import {
  HomeOutlined,
  FileDoneOutlined,
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
    icon: <FileDoneOutlined />,
    title: "FormPlatform",
    onClick: () => navigate("/"),
  },
];

export default getMenuItems;
