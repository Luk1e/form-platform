import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Spin, Typography, Alert, Button, Popconfirm, App } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { useCustomNavigate } from "../../../utils/hooks";
import {
  getTemplateById,
  resetGetTemplateState,
} from "../../../toolkit/templates/getTemplateSlice";
import { getForm, resetGetFormState } from "../../../toolkit/user/getFormSlice";
import {
  deleteForm,
  resetDeleteFormState,
} from "../../../toolkit/user/deleteFormSlice";

import UpdateForm from "./UpdateForm";

const { Title, Text } = Typography;

function UpdateFormPage() {
  const dispatch = useDispatch();
  const { id, formId } = useParams();
  const { t } = useTranslation(["auth"]);
  const { notification } = App.useApp();
  const goBackOrNavigate = useCustomNavigate(`/templates/${id}`);
  const {
    template,
    error: errorTemplate,
    loading: loadingTemplate,
  } = useSelector((state) => state.template);
  const { form, error, loading } = useSelector((state) => state.getForm);
  const { loading: deleteLoading } = useSelector((state) => state.deleteForm);

  useEffect(() => {
    dispatch(getTemplateById({ id }));
    dispatch(getForm(formId));

    return () => {
      dispatch(resetGetTemplateState());
      dispatch(resetGetFormState());
      dispatch(resetDeleteFormState());
    };
  }, [dispatch, id, formId]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteForm(formId)).unwrap();
      notification.success({
        message: t("notifications.formDeleted"),
        description: t("notifications.formDeletedDesc"),
      });
      goBackOrNavigate();
    } catch (error) {
      notification.error({
        message: "Something went wrong...",
      });
    }
  };

  if (loadingTemplate || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (errorTemplate || error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert
          type="error"
          message={
            errorTemplate
              ? errorTemplate.errorCode
                ? t(`errors.${errorTemplate.errorCode}`)
                : error.message
              : error.errorCode
              ? t(`errors.${error.errorCode}`)
              : error.message
          }
          className="max-w-md"
        />
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex justify-end">
        <Popconfirm
          title={t("formPage.deleteConfirmTitle")}
          description={t("formPage.deleteConfirmDesc")}
          onConfirm={handleDelete}
          okText={t("formPage.yes")}
          cancelText={t("formPage.no")}
        >
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            loading={deleteLoading}
          >
            {t("formPage.delete")}
          </Button>
        </Popconfirm>
      </div>

      <Card
        className="shadow-lg rounded-2xl"
        bordered={false}
        loading={loading || loadingTemplate}
      >
        <div className="space-y-6">
          <div className="border-b pb-6">
            <Title level={2} className="!mb-2">
              {template.title}
            </Title>
            {template.description && (
              <Text className="text-base opacity-85">
                {template.description}
              </Text>
            )}
          </div>

          <UpdateForm form={form} template={template} />
        </div>
      </Card>
    </div>
  );
}

export default UpdateFormPage;
