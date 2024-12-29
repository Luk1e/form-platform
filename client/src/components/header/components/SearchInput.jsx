import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchInput = ({ t }) => (
  <Input
    placeholder={t("global.searchForms")}
    prefix={<SearchOutlined />}
    className="w-full rounded-full"
  />
);

export default SearchInput;
