import { Button } from "antd";

function ButtonComponent({ isLoading, t }) {
  return (
    <Button
      type="primary"
      htmlType="submit"
      loading={isLoading}
      className="w-full bg-purple-6 hover:!bg-purple-7
             dark:bg-purple-5 dark:hover:!bg-purple-4 dark:text-purple-9"
    >
      {t("global.registerButton")}
    </Button>
  );
}

export default ButtonComponent;
