import React from "react";
import { Card } from "antd";
import { useTranslation } from "react-i18next";
import LoginForm from "./LoginForm";

const LoginCard = () => {
  const { t } = useTranslation(["app"]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-1 dark:bg-purple-9 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-purple-8 shadow-xl rounded-lg border-purple-3 dark:border-purple-7">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-7 dark:text-purple-2">
            {t("auth.login")}
          </h2>
          <p className="mt-2 text-sm text-purple-5 dark:text-purple-3">
            {t("auth.welcome")}
          </p>
        </div>
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginCard;
