import { Card } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import LoginForm from "./components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["app"]);
  const { user } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-xl rounded-lg ">
        <div className="text-center">
          <h2 className="text-3xl font-bold ">{t("global.login")}</h2>
          <p className="m-2 text-sm">{t("global.signInText")}</p>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
