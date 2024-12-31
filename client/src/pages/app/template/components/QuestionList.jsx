import React from "react";
import { Card } from "antd";
import {
  FormOutlined,
  AlignLeftOutlined,
  NumberOutlined,
  CheckSquareOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import RenderQuestionOptions from "./RenderQuestionOptions";
import { useTranslation } from "react-i18next";

const questionTypeConfig = {
  single_line: {
    icon: <FormOutlined className="text-blue-600 dark:text-blue-400" />,
    color:
      "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  },
  multi_line: {
    icon: <AlignLeftOutlined className="text-green-600 dark:text-green-400" />,
    color:
      "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
  },
  integer: {
    icon: <NumberOutlined className="text-purple-600 dark:text-purple-400" />,
    color:
      "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
  },
  checkbox: {
    icon: (
      <CheckSquareOutlined className="text-orange-600 dark:text-orange-400" />
    ),
    color:
      "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800",
  },
  single_choice: {
    icon: <CheckCircleOutlined className="text-pink-600 dark:text-pink-400" />,
    color:
      "bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800",
  },
};

const QuestionList = ({ questions }) => {
  const { t } = useTranslation(["app"]);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium dark:text-gray-200">
        {t("templatePage.questions")}
      </h3>
      {questions.map((question, index) => {
        const typeConfig = questionTypeConfig[question.QuestionType.name];

        return (
          <Card
            key={question.id}
            className={`shadow-sm hover:shadow-md transition-shadow duration-200 
              ${typeConfig.color} border-2 dark:shadow-gray-900`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 text-lg">{typeConfig.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium dark:text-gray-200">
                    {index + 1}. {question.title}
                  </h4>
                  {question.is_required && (
                    <span className="text-red-500 dark:text-red-400 text-sm">
                      *
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {question.description}
                </p>
                <RenderQuestionOptions question={question} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default QuestionList;
