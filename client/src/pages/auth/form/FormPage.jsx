import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Alert, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  getTemplateById,
  resetGetTemplateState,
} from "../../../toolkit/templates/getTemplateSlice";
import { getForm, resetGetFormState } from "../../../toolkit/user/getFormSlice";

import { FormHeader, QuestionItem } from "./components";

function FormPage() {
  const dispatch = useDispatch();
  const { id, formId } = useParams();
  const { token } = theme.useToken();

  const {
    template,
    error: errorTemplate,
    loading: loadingTemplate,
  } = useSelector((state) => state.template);

  const { form, error, loading } = useSelector((state) => state.getForm);

  useEffect(() => {
    dispatch(getTemplateById({ id }));
    dispatch(getForm(formId));

    return () => {
      dispatch(resetGetTemplateState());
      dispatch(resetGetFormState());
    };
  }, [dispatch, id, formId]);

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
          message={"Something went wrong..."}
          className="max-w-md"
        />
      </div>
    );
  }

  if (!template || !form) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card
        bordered={false}
        style={{
          backgroundColor: token.colorBgContainer,
          boxShadow: token.boxShadow,
        }}
        className="rounded-2xl"
      >
        <div className="space-y-6">
          <FormHeader
            title={template.title}
            description={template.description}
            username={template.User.username}
            createdAt={form.created_at}
          />

          <div className="space-y-6">
            {template.TemplateQuestions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                value={form.initialValues[`question_${question.id}`]}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FormPage;
