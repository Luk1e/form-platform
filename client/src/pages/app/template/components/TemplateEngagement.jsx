import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  HeartFilled,
  SendOutlined,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Button, Input, Avatar, List, Tooltip, Space, App } from "antd";

import {
  toggleLike,
  addComment,
  getTemplateEngagements,
  resetTemplateEngagementState,
} from "../../../../toolkit/support/templateEngagementSlice";

const { TextArea } = Input;

const TemplateEngagement = ({ username }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [t] = useTranslation("app");
  const { notification } = App.useApp();

  const { user } = useSelector((state) => state.authentication);
  const { engagements } = useSelector((state) => state.templateEngagement);

  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    dispatch(getTemplateEngagements({ id, userId: user?.id }));
    return () => {
      dispatch(resetTemplateEngagementState());
    };
  }, [dispatch, id, user]);

  useEffect(() => {
    let intervalId = setInterval(() => {
      dispatch(getTemplateEngagements({ id, userId: user?.id }));
    }, 5000);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [dispatch, id, user]);

  const handleToggleLike = async () => {
    if (user) {
      dispatch(toggleLike(id));
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      notification.error({ message: t("templatePage.emptyComment") });
      return;
    }

    try {
      await dispatch(
        addComment({
          id,
          content: commentContent.trim(),
        })
      ).unwrap();
      setCommentContent("");
      notification.success({ message: t("templatePage.commentAdded") });
    } catch (error) {
      notification.error({ message: t("templatePage.commentError") });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 pt-4 border-t border-gray-200">
        <Space size="large" className="flex items-center">
          <div className="flex items-center gap-2">
            <Tooltip
              title={
                user
                  ? t("templatePage.toggleLike")
                  : t("templatePage.loginToLike")
              }
            >
              <Button
                type="text"
                onClick={handleToggleLike}
                className={`flex items-center hover:bg-gray-50 ${
                  !user && "opacity-50 cursor-not-allowed"
                }`}
                icon={
                  engagements?.has_liked ? (
                    <HeartFilled className="text-red-500 text-lg transition-colors duration-200" />
                  ) : (
                    <HeartOutlined className="text-gray-600 text-lg transition-colors duration-200" />
                  )
                }
              />
            </Tooltip>
            <span className="font-medium text-gray-700">
              {engagements?.like_count}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="text"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center hover:bg-gray-50"
              icon={<MessageOutlined className="text-gray-600 text-lg" />}
            />
            <span className="font-medium text-gray-700">
              {engagements?.comment_count}
            </span>
          </div>
        </Space>
        <div className="text-sm">
          <span className="text-gray-500">
            {t("templatePage.createdBy")}:{" "}
            <span className="text-gray-700 font-medium">{username}</span>
          </span>
        </div>
      </div>

      {showComments && (
        <div className="space-y-4 mt-4">
          <div className="relative">
            <TextArea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("templatePage.addComment")}
              autoSize={{ minRows: 2, maxRows: 6 }}
              disabled={!user}
              className="pr-24"
            />
            <Button
              type="primary"
              onClick={handleAddComment}
              disabled={!user}
              icon={<SendOutlined />}
              className="absolute right-2 bottom-2"
            />
          </div>

          <List
            className="comments-list"
            itemLayout="horizontal"
            dataSource={engagements?.Comments || []}
            renderItem={(comment) => (
              <List.Item className="block sm:flex px-4">
                <div className="flex items-start gap-4 w-full">
                  <Avatar className="mt-1">
                    {comment.User.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4">
                      <span className="font-medium truncate">
                        {comment.User.username}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1 whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default TemplateEngagement;
