import { useState } from "react";
import { Button, Tooltip } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { toggleTheme } from "../../toolkit/theme/themeSlice";

import getMenuItems from "./components/menuItems";
import ButtonComponent from "./components/ButtonComponent";
import { useNavigate } from "react-router-dom";

const FloatingActionMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const { t, i18n } = useTranslation(["components"]);
  const themeMode = useSelector((state) => state.theme.mode);

  const toggleThemeMethod = () => {
    dispatch(toggleTheme());
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "eng" ? "geo" : "eng");
  };

  const menuItems = getMenuItems({
    t,
    navigate,
    toggleLanguage,
    theme: themeMode,
    toggleThemeMethod,
    language: i18n.language,
  });

  return (
    <div className="fixed bottom-8 right-8 z-50 hidden md:block">
      <div className="relative">
        {/* Expanded Menu Items */}
        <div
          className={`absolute bottom-12 right-0 flex flex-col gap-3 transition-all duration-300 ease-in-out ${
            isExpanded
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-4 pointer-events-none"
          }`}
        >
          {menuItems.map((item, index) => (
            <Tooltip key={index} title={item.title} placement="left">
              <Button
                type="primary"
                shape="circle"
                icon={item.icon}
                size="large"
                onClick={item.onClick}
                className={`shadow-lg transform transition-all duration-300  
                          bg-purple-1 dark:bg-purple-6
                          text-purple-6 dark:text-purple-1 
                          hover:!bg-purple-5 dark:hover:!bg-purple-1
                          border-purple-5 dark:hover:!text-purple-5
                            ${item.className}`}
              />
            </Tooltip>
          ))}
        </div>

        {/* Main Toggle Button */}
        <ButtonComponent
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </div>
    </div>
  );
};

export default FloatingActionMenu;
