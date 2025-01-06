import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["app"]);

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle={t("global.pageNotFound")}
        extra={[
          <Button
            type="primary"
            onClick={navigateToHome}
            className="bg-blue-500 hover:bg-blue-600"
            key="home"
          >
            {t("global.backHome")}
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorPage;
