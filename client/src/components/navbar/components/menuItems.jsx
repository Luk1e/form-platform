import Flags from "react-world-flags";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FileDoneOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";

import { toggleTheme } from "../../../toolkit/theme/themeSlice";

const MenuItems = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation(["components"]);
  const themeMode = useSelector((state) => state.theme.mode);
  const language = i18n.language;

  const navigateToHome = () => {
    navigate("/");
  };

  const toggleThemeMethod = () => {
    dispatch(toggleTheme());
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "eng" ? "geo" : "eng");
  };

  return [
    {
      icon: (
        <div className="flex items-center justify-center">
          {themeMode === "dark" ? <MoonOutlined /> : <SunOutlined />}
        </div>
      ),
      title: `${
        themeMode === "dark" ? t("global.dark") : t("global.light")
      } ${t("global.theme")}`,
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
      onClick: navigateToHome,
    },
  ];
};

export default MenuItems;
