import { Input } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

const SearchInput = ({ t, isMobile, onClose }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleSearch = () => {
    navigate(`/search?query=${value}`);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder={t("global.searchForms")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={handleSearch}
        className="w-full rounded-full shadow-sm"
      />
      <SearchOutlined
        onClick={handleSearch}
        className="absolute top-1/2 right-4 -translate-y-1/2 text-lg text-gray-500 cursor-pointer hover:text-blue-500 transition-all"
      />
    </div>
  );
};

export default SearchInput;
