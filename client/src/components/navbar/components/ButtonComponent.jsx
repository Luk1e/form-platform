import { Button } from "antd";
import { SettingOutlined, CloseOutlined } from "@ant-design/icons";

function ButtonComponent({ isExpanded, setIsExpanded }) {
  return (
    <Button
      type="primary"
      shape="circle"
      size="large"
      icon={isExpanded ? <CloseOutlined /> : <SettingOutlined />}
      onClick={() => setIsExpanded(!isExpanded)}
      className={`shadow-lg transform transition-all duration-300 
               ${
                 isExpanded
                   ? "bg-purple-6 dark:bg-purple-6 hover:!bg-purple-5 dark:hover:!bg-purple-5 rotate-180"
                   : "bg-purple-5 dark:bg-purple-6 hover:!bg-purple-6 dark:hover:!bg-purple-5 rotate-0"
               }`}
    />
  );
}

export default ButtonComponent;
