import { Drawer, Menu } from "antd";
import { useWindowSize } from "react-use";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileDoneOutlined, MenuOutlined } from "@ant-design/icons";

import { SearchInput, UserDropdown, MenuDropdownList } from "./components";

function MobileHeader() {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const { t } = useTranslation(["components"]);
  const { user } = useSelector((state) => state.authentication);

  const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);

  const closeDrawer = () => {
    setIsMobileDrawerVisible(false);
  };

  const dropdownList = MenuDropdownList(user, closeDrawer);

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
        className="text-2xl transition-colors duration-300"
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
      {!user ? <UserDropdown /> : <div></div>}

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsMobileDrawerVisible(false)}
        open={isMobileDrawerVisible}
      >
        <div className="mb-5">
          <SearchInput t={t} />
        </div>
        <Menu items={dropdownList} />
      </Drawer>
    </div>
  );
}

export default MobileHeader;
