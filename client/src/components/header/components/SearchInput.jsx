import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchInput = ({ t }) => (
  <Input
    placeholder={t("global.searchForms")}
    prefix={<SearchOutlined  />}
    className="w-full rounded-full border-none outline-none  shadow-none ring-0  transition-all duration-300"
  />
);

export default SearchInput;
