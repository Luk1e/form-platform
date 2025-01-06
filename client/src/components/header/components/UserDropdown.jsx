import { Dropdown, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

import UserDropdownList from "./UserDropdownList";

function UserDropdown() {
  const dropdownList = UserDropdownList();

  return (
    <Dropdown
      menu={{
        items: dropdownList,
        className: "w-48",
      }}
      placement="bottom"
      trigger={["click"]}
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      <Avatar
        icon={<UserOutlined />}
        className={`
          cursor-pointer 
          transition-colors 
          duration-300`}
      />
    </Dropdown>
  );
}

export default UserDropdown;
