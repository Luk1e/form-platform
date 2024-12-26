import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import QuestionField from "./QuestionField";

const SortableQuestion = ({ id, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-move">
          <HolderOutlined />
        </div>
        <div className="flex-1">
          <QuestionField {...props} />
        </div>
      </div>
    </div>
  );
};

export default SortableQuestion;
