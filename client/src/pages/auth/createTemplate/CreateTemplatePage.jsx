import React from "react";
import { Card } from "antd";
import TemplateForm from "./components/TemplateForm";

const CreateTemplatePage = () => (
  <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
    <Card title="Create Template" className="shadow-lg">
      <TemplateForm />
    </Card>
  </div>
);
export default CreateTemplatePage;
