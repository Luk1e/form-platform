import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ErrorPage = () => {
  const navigate = useNavigate();
  const [t] = useTranslation("app");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle={t("global.pageNotFound")}
        extra={[
          <Button
            type="primary"
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600"
            key="home"
          >
            {t("global.backHome")}
          </Button>,
          <Button
            onClick={() => navigate(-1)}
            className="hover:bg-gray-100"
            key="back"
          >
            {t("global.goBack")}
          </Button>,
        ]}
      />
    </div>
  );
};

export default ErrorPage;
