import { Card } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["app"]);
  const { user } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-1 dark:bg-purple-9 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-purple-8 shadow-xl rounded-lg border-purple-3 dark:border-purple-7">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-7 dark:text-purple-2">
            {t("global.register")}
          </h2>
          <p className="m-2 text-sm text-purple-5 dark:text-purple-3">
            {t("global.signUpText")}
          </p>
        </div>
        <RegisterForm />
      </Card>
    </div>
  );
};

export default RegisterPage;
