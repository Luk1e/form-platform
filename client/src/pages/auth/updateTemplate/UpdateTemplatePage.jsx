import React, { useEffect } from "react";
import { Card, Button, App, Popconfirm } from "antd";
import TemplateForm from "./components/TemplateForm";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import {
  getTemplateById,
  resetGetTemplateState,
} from "../../../toolkit/templates/getTemplateSlice";
import { deleteTemplate } from "../../../toolkit/templates/deleteTemplateSlice";

const UpdateTemplatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notification } = App.useApp();
  const { template, loading } = useSelector((state) => state.template);
  const [t] = useTranslation("auth");

  useEffect(() => {
    if (id) {
      dispatch(getTemplateById(id));
    }
    return () => {
      dispatch(resetGetTemplateState());
    };
  }, [dispatch, id]);

  const navigateToForms = () => {
    navigate(`/templates/${id}/forms`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTemplate(id)).unwrap();
      notification.success({
        message: t("notifications.templateDeleteSuccess"),
      });
      navigate("/my-content");
    } catch (error) {
      notification.error({
        message: t(`errors.${error.errorCode}`),
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-4">
      <div className="flex justify-end space-x-4">
        <Button icon={<FormOutlined />} onClick={navigateToForms}>
          {t("updateTemplatePage.viewForms")}
        </Button>
        <Popconfirm
          title={t("userContentPage.deleteConfirm")}
          onConfirm={handleDelete}
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            {t("updateTemplatePage.deleteTemplate")}
          </Button>
        </Popconfirm>
      </div>

      <Card
        title={t("updateTemplatePage.updateTemplate")}
        className="shadow-lg [&_.ant-card-head-title]:sm:text-2xl"
        loading={loading}
      >
        {template && <TemplateForm templateId={id} />}
      </Card>
    </div>
  );
};

export default UpdateTemplatePage;
