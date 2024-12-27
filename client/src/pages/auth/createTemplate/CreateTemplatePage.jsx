import React from "react";
import { Card } from "antd";
import TemplateForm from "./components/TemplateForm";
import { useTranslation } from "react-i18next";

const CreateTemplatePage = () => {
  const [t] = useTranslation("auth");
  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      <Card
        title={t("createTemplatePage.createTemplate")}
        className="shadow-lg [&_.ant-card-head-title]:sm:text-2xl"
      >
        <TemplateForm />
      </Card>
    </div>
  );
};
export default CreateTemplatePage;
