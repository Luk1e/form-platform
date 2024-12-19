import { Link } from "react-router-dom";
import { LoginOutlined, FormOutlined } from "@ant-design/icons";

const getMenuItems = (t) => [
  {
    key: "login",
    icon: <LoginOutlined />,
    label: <Link to={"/login"}>{t("global.login")}</Link>,
  },
  {
    key: "register",
    icon: <FormOutlined />,
    label: <Link to={"/register"}>{t("global.register")}</Link>,
  },
];

export default getMenuItems;
