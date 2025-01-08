import { Button } from "antd";
import { useTranslation } from "react-i18next";

function ButtonComponent({ loading }) {
  const { t } = useTranslation("auth");

  return (
    <div className="flex justify-end">
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        className="w-full sm:w-auto"
        loading={loading}
      >
        {t("createTemplatePage.createTemplate")}
      </Button>
    </div>
  );
}

export default ButtonComponent;
