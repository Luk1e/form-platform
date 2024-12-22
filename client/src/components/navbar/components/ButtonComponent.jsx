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
      className={"shadow-lg transform transition-all duration-300"}
    />
  );
}

export default ButtonComponent;
