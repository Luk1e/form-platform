import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Card } from "antd";
import { useTranslation } from "react-i18next";
import {
  getTemplateById,
  resetGetTemplateState,
} from "../../../toolkit/templates/getTemplateSlice";

import {
  QuestionList,
  TemplateHeader,
  TemplateEngagement,
  TemplateInfo,
} from "./components";

const TemplatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [t] = useTranslation("app");

  const { template, loading, error } = useSelector((state) => state.template);
  const { user } = useSelector((state) => state.authentication);

  useEffect(() => {
    dispatch(getTemplateById({ id, userId: user?.id }));
    return () => {
      dispatch(resetGetTemplateState());
    };
  }, [dispatch, id, user]);

  const handleToggleView = (value) => {
    if (value) {
      navigate(`/templates/${id}/fill`);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Alert
          type="error"
          message={
            error?.errorCode
              ? t(`errors.${error.errorCode}`)
              : "somethingWentWrong"
          }
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      {template && (
        <Card className="shadow-lg" loading={loading}>
          <div className="space-y-6">
            <TemplateHeader
              title={template.title}
              user={user}
              access_users={template.AccessUsers}
              onToggleView={handleToggleView}
            />
            <TemplateInfo template={template} />
            <QuestionList questions={template.TemplateQuestions} />
            <TemplateEngagement username={template.User.username} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default TemplatePage;
