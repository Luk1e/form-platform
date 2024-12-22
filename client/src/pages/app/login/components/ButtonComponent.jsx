import { Button } from "antd";

function ButtonComponent({ isLoading, t }) {
  return (
    <Button
      type="primary"
      htmlType="submit"
      loading={isLoading}
      className="w-full"
    >
      {t("global.loginButton")}
    </Button>
  );
}

export default ButtonComponent;
