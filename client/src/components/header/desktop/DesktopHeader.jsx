import { FileDoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import SearchInput from "../components/SearchInput";
import DropDownComponent from "../components/DropDownComponent";

function DesktopHeader({ isMenuVisible, setIsMenuVisible }) {
  const navigate = useNavigate();
  const { t } = useTranslation(["components"]);

  return (
    <div className="flex items-center">
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

      {/* Vertical Separator */}
      <div className="h-8 border-r mx-4" />

      {/* Search Bar */}
      <div className="flex-grow max-w-md mr-2">
        <SearchInput t={t} />
      </div>

      {/* User Dropdown */}
      <div className="ml-auto">
        <DropDownComponent
          isMenuVisible={isMenuVisible}
          setIsMenuVisible={setIsMenuVisible}
        />
      </div>
    </div>
  );
}

export default DesktopHeader;
