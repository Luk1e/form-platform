import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, Spin, Typography, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTemplateById,
  resetGetTemplateState,
} from "../../../toolkit/templates/getTemplateSlice";
import { checkIsFilled } from "../../../toolkit/user/createFormSlice";

import CreateForm from "./CreateForm";

const { Title, Text } = Typography;

const CreateFormPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["auth"]);
  const { template, error, loading } = useSelector((state) => state.template);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await dispatch(checkIsFilled(id)).unwrap();
        if (data?.hasFilled && data?.formId) {
          navigate(`/templates/${id}/forms/${data?.formId}/update`, {
            replace: true,
          });
        } else {
          dispatch(getTemplateById({ id }));
        }
      }
    };

    fetchData();

    return () => {
      dispatch(resetGetTemplateState());
    };
  }, [dispatch, navigate, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert
          type="error"
          message={
            error.errorCode ? t(`errors.${error.errorCode}`) : error.message
          }
          className="max-w-md"
        />
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card
        className="shadow-lg rounded-2xl"
        bordered={false}
        loading={loading}
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

          <CreateForm template={template} />
        </div>
      </Card>
    </div>
  );
};

export default CreateFormPage;
