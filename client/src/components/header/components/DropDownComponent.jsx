import { Dropdown, Avatar } from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";

import getMenuItems from "./getMenuItems";

function DropDownComponent({ isMenuVisible, setIsMenuVisible }) {
  const { t } = useTranslation(["components"]);

  const menuItems = getMenuItems(t);
  return (
    <Dropdown
      menu={{ items: menuItems.slice(0, 2) }}
      placement="bottom"
      trigger={["click"]}
      onOpenChange={(visible) => setIsMenuVisible(visible)}
    >
      <Avatar
        icon={<UserOutlined />}
        className={`cursor-pointer transition-colors duration-300  ${
          isMenuVisible
            ? "bg-purple-5 dark:bg-purple-5 hover:bg-purple-4 dark:hover:bg-purple-6"
            : "bg-purple-4 dark:bg-purple-6 hover:bg-purple-5 dark:hover:bg-purple-5"
        }`}
      />
    </Dropdown>
  );
}

export default DropDownComponent;
