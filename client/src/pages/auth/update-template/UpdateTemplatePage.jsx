import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button, App, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { useCustomNavigate } from "../../../utils/hooks";

import {
  getUserTemplateById,
  resetGetTemplateState,
} from "../../../toolkit/templates/getTemplateSlice";
import { deleteTemplate } from "../../../toolkit/templates/deleteTemplateSlice";

import TemplateForm from "./TemplateForm";

const UpdateTemplatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goBackOrNavigate = useCustomNavigate("/");
  const { t } = useTranslation("auth");
  const { notification } = App.useApp();
  const { template, loading } = useSelector((state) => state.template);

  useEffect(() => {
    if (id) {
      const fetchTemplate = async () => {
        try {
          await dispatch(getUserTemplateById(id)).unwrap();
        } catch (error) {
          notification.error({
            message: error.errorCode
              ? t(`errors.${error.errorCode}`)
              : "Something went wrong",
          });
        }
      };

      fetchTemplate();
    }
    return () => {
      dispatch(resetGetTemplateState());
    };
  }, [dispatch, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateToForms = () => {
    navigate(`/templates/${id}/forms`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTemplate(id)).unwrap();
      notification.success({
        message: t("notifications.templateDeleteSuccess"),
      });
      goBackOrNavigate();
    } catch (error) {
      notification.error({
        message: t(`errors.${error.errorCode}`),
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-4">
      <div className="flex justify-end space-x-4">
        {/* Template forms */}
        <Button icon={<FormOutlined />} onClick={navigateToForms}>
          {t("updateTemplatePage.viewForms")}
        </Button>

        {/* Delete template button */}
        <Popconfirm
          title={t("userContentPage.deleteConfirm")}
          onConfirm={handleDelete}
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            {t("updateTemplatePage.deleteTemplate")}
          </Button>
        </Popconfirm>
      </div>

      {/* Template card */}
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
