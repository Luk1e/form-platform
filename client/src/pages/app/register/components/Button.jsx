import { Button } from "antd";
import { useTranslation } from "react-i18next";

function ButtonComponent({ loading }) {
  const { t } = useTranslation(["app"]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      loading={loading}
      className="w-full"
    >
      {t("global.registerButton")}
    </Button>
  );
}

export default ButtonComponent;
