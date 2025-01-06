import React from "react";
import { Tag } from "antd";
import { TagOutlined } from "@ant-design/icons";

import { getTagColor } from "../../../../utils/helpers";

const tagStyle = {
  cursor: "pointer",
  transition: "all 0.2s",
  fontSize: "0.875rem",
  padding: "2px 8px",
};

const TagCloud = ({ tags, onTagClick }) => {
  const maxCount = Math.max(...tags.map((tag) => tag.count));

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center p-2">
      {tags.map((tag) => (
        <Tag
          key={tag.name}
          onClick={() => onTagClick(tag.id)}
          style={tagStyle}
          className="inline-flex items-center rounded-full m-0.5 text-xs sm:text-sm"
          color={getTagColor(tag.count, maxCount)}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          <TagOutlined className="mr-1 text-xs" />
          <span className="font-medium">{tag.name}</span>
          <span className="ml-1 text-xs bg-white/20 px-1 py-0.5 rounded-full">
            {tag.count}
          </span>
        </Tag>
      ))}
    </div>
  );
};

export default TagCloud;
