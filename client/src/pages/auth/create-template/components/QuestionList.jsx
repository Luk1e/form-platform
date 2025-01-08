import { Button } from "antd";
import { FieldArray } from "formik";
import { useTranslation } from "react-i18next";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableQuestion from "./SortableQuestion";

import { getQuestionTypes } from "../../../../utils/helpers";

const QuestionList = ({ formikProps }) => {
  const { t } = useTranslation("auth");
  const { values, setFieldValue } = formikProps;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const questionTypes = getQuestionTypes(t) || [];
  const questionIds = values.questions.map((_, index) => `question-${index}`);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id.split("-")[1]);
      const newIndex = parseInt(over.id.split("-")[1]);
      setFieldValue(
        "questions",
        arrayMove(values.questions, oldIndex, newIndex)
      );
    }
  };

  return (
    <FieldArray name="questions">
      {({ push, remove }) => (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
            {/* Questions title */}
            <h3 className="text-lg sm:text-xl font-medium">
              {t("createTemplatePage.questions.title")}
            </h3>

            {/* Question types */}
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              {questionTypes.map((type) => (
                <Button
                  key={type.id}
                  type="dashed"
                  onClick={() =>
                    push({
                      type_id: type.id,
                      title: "",
                      description: "",
                      display_in_summary: false,
                      is_required: false,
                      options:
                        type.id === 4 || type.id === 5 ? [""] : undefined,
                    })
                  }
                >
                  {t("createTemplatePage.questions.add", { type: type.name })}
                </Button>
              ))}
            </div>
          </div>

          {/* Question List */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={questionIds}
              strategy={verticalListSortingStrategy}
            >
              {values.questions.map((question, index) => (
                <SortableQuestion
                  key={`question-${index}`}
                  id={`question-${index}`}
                  index={index}
                  remove={remove}
                  formikProps={formikProps}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </FieldArray>
  );
};

export default QuestionList;
