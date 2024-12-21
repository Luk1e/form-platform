import { Drawer, Menu, App } from "antd";
import { useWindowSize } from "react-use";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { FileDoneOutlined, MenuOutlined } from "@ant-design/icons";

import getMenuItems from "./getMenuItems";
import SearchInput from "../components/SearchInput";
import DropDownComponent from "../components/DropDownComponent";
import { toggleTheme } from "../../../toolkit/theme/themeSlice";
import { logout } from "../../../toolkit/auth/authSlice";

function MobileHeader({ isMenuVisible, setIsMenuVisible }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { t, i18n } = useTranslation(["components"]);

  const { notification } = App.useApp();
  const themeMode = useSelector((state) => state.theme.mode);
  const { user } = useSelector((state) => state.authentication);

  const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);
  
  const closeDrawer = () => {
    setIsMobileDrawerVisible(false);
  };

  const toggleThemeMethod = () => {
    dispatch(toggleTheme());
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "eng" ? "geo" : "eng");
  };

  const logoutMethod = useCallback(() => {
    dispatch(logout());
    navigate("/");
    notification.success({
      message: t("notifications.logoutSuccess"),
      description: t("notifications.goodBye"),
      className: `
          !bg-purple-1 dark:!bg-purple-8 
          [&_.ant-notification-notice-message]:!text-purple-9 
          [&_.ant-notification-notice-message]:dark:!text-purple-2
          [&_.ant-notification-notice-description]:!text-purple-7
          [&_.ant-notification-notice-description]:dark:!text-purple-3
          [&_.ant-notification-notice-icon]:!text-purple-6 
          [&_.ant-notification-notice-icon]:dark:!text-purple-3
          [&_.ant-notification-notice-close]:!text-purple-6
          [&_.ant-notification-notice-close]:!dark:text-purple-3
          [&_.ant-notification-notice-close]:hover:!text-purple-8
          [&_.ant-notification-notice-close]:dark:hover:!text-purple-1
          !border-purple-3 dark:!border-purple-7
        `,
    });
    closeDrawer();
  }, [dispatch, notification, t]);

  const menuItems = getMenuItems({
    t,
    user,
    logoutMethod,
    closeDrawer,
    toggleLanguage,
    theme: themeMode,
    toggleThemeMethod,
    language: i18n.language,
  });

  useEffect(() => {
    if (width > 768 && isMobileDrawerVisible) {
      setIsMobileDrawerVisible(false);
    }
  }, [width, isMobileDrawerVisible]);

  return (
    <div className="flex items-center justify-between  h-16">
      {/* Mobile Menu Trigger */}
      <MenuOutlined
        onClick={() => setIsMobileDrawerVisible(true)}
        className="text-2xl text-purple-8 dark:text-purple-1 hover:text-purple-7 dark:hover:text-purple-5 transition-colors duration-300"
      />

      {/* Logo and Platform Name */}
      <div className="flex items-center space-x-3">
        <FileDoneOutlined className="text-3xl " />
        <span
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          FormPlatform
        </span>
      </div>

      {/* User Dropdown */}
      {!user ? (
        <DropDownComponent
          isMenuVisible={isMenuVisible}
          setIsMenuVisible={setIsMenuVisible}
        />
      ) : (
        <div></div>
      )}

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsMobileDrawerVisible(false)}
        open={isMobileDrawerVisible}
        className="!bg-purple-2 dark:!bg-purple-3"
      >
        <div className="mb-5">
          <SearchInput t={t} />
        </div>
        <Menu items={menuItems} className="bg-purple-2 dark:bg-purple-3" />
      </Drawer>
    </div>
  );
}

export default MobileHeader;
