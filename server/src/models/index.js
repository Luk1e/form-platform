import sequelize from "../../config/database.js";
import User from "./User.js";
import TemplateTopic from "./TemplateTopic.js";
import Template from "./Template.js";
import TemplateTag from "./TemplateTag.js";
import QuestionType from "./QuestionType.js";
import TemplateQuestion from "./TemplateQuestion.js";
import QuestionOption from "./QuestionOption.js";
import FilledForm from "./FilledForm.js";
import FormAnswer from "./FormAnswer.js";
import Comment from "./Comment.js";
import Like from "./Like.js";

User.hasMany(Template, { foreignKey: "user_id" });
Template.belongsTo(User, { foreignKey: "user_id" });

TemplateTopic.hasMany(Template, { foreignKey: "template_topic_id" });
Template.belongsTo(TemplateTopic, { foreignKey: "template_topic_id" });

Template.belongsToMany(TemplateTag, {
  through: "template_tag_mapping",
  foreignKey: "template_id",
  otherKey: "template_tag_id",
});

TemplateTag.belongsToMany(Template, {
  through: "template_tag_mapping",
  foreignKey: "template_tag_id",
  otherKey: "template_id",
});

Template.belongsToMany(User, {
  through: "template_access_control",
  foreignKey: "template_id",
  otherKey: "user_id",
  as: "AccessUsers",
});

User.belongsToMany(Template, {
  through: "template_access_control",
  foreignKey: "user_id",
  otherKey: "template_id",
  as: "AccessibleTemplates",
});

QuestionType.hasMany(TemplateQuestion, { foreignKey: "question_type_id" });
TemplateQuestion.belongsTo(QuestionType, { foreignKey: "question_type_id" });

Template.hasMany(TemplateQuestion, { foreignKey: "template_id" });
TemplateQuestion.belongsTo(Template, { foreignKey: "template_id" });

TemplateQuestion.hasMany(QuestionOption, {
  foreignKey: "template_question_id",
});
QuestionOption.belongsTo(TemplateQuestion, {
  foreignKey: "template_question_id",
});

Template.hasMany(FilledForm, { foreignKey: "template_id" });
FilledForm.belongsTo(Template, { foreignKey: "template_id" });

User.hasMany(FilledForm, { foreignKey: "user_id" });
FilledForm.belongsTo(User, { foreignKey: "user_id" });

FilledForm.hasMany(FormAnswer, { foreignKey: "filled_form_id" });
FormAnswer.belongsTo(FilledForm, { foreignKey: "filled_form_id" });

TemplateQuestion.hasMany(FormAnswer, { foreignKey: "template_question_id" });
FormAnswer.belongsTo(TemplateQuestion, { foreignKey: "template_question_id" });

Template.hasMany(Comment, { foreignKey: "template_id" });
Comment.belongsTo(Template, { foreignKey: "template_id" });

User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

User.belongsToMany(Template, { through: Like });
Template.belongsToMany(User, { through: Like });

const models = {
  User,
  TemplateTopic,
  Template,
  TemplateTag,
  QuestionType,
  TemplateQuestion,
  QuestionOption,
  FilledForm,
  FormAnswer,
  Comment,
  Like,
  sequelize,
};

export default models;
