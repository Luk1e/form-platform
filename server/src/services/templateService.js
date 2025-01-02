import { CustomError } from "../utils/index.js";
import models from "../models/index.js";
import { Op } from "sequelize";
const {
  User,
  Template,
  TemplateTag,
  FilledForm,
  QuestionOption,
  TemplateQuestion,
  TemplateTopic,
  QuestionType,
  sequelize,
} = models;

const templateService = {
  createTemplate: async (userId, templateData) => {
    const {
      title,
      description,
      topic_id,
      image_url,
      is_public,
      tags,
      questions,
      access_users,
    } = templateData;

    const transaction = await models.sequelize.transaction();

    try {
      const template = await Template.create(
        {
          user_id: userId,
          title,
          description,
          template_topic_id: topic_id,
          image_url,
          is_public,
        },
        { transaction }
      );

      // Handle tags
      if (tags?.length > 0) {
        const createdTags = await Promise.all(
          tags.map(async (tagName) => {
            const [tag] = await TemplateTag.findOrCreate({
              where: { name: tagName.toLowerCase().trim() },
              transaction,
            });
            return tag;
          })
        );
        await template.setTemplateTags(createdTags, { transaction });
      }

      // Handle access control for private templates
      if (!is_public && access_users?.length > 0) {
        const users = await User.findAll({
          where: { id: access_users },
          transaction,
        });
        await template.setAccessUsers(users, { transaction });
      }

      // Handle questions
      if (questions?.length > 0) {
        const createdQuestions = await Promise.all(
          questions.map(async (question, index) => {
            const createdQuestion = await TemplateQuestion.create(
              {
                template_id: template.id,
                question_type_id: question.type_id,
                title: question.title,
                description: question.description,
                display_in_summary: question.display_in_summary || false,
                position: index + 1,
                is_required: question.is_required || false,
              },
              { transaction }
            );

            // Handle question options for single choice and checkbox questions
            if (
              (question.type_id === 4 || question.type_id === 5) &&
              question.options?.length > 0
            ) {
              const optionData = question.options.map((option) => ({
                template_question_id: createdQuestion.id,
                value: option,
              }));

              await QuestionOption.bulkCreate(optionData, { transaction });
            }

            return createdQuestion;
          })
        );
      }

      await transaction.commit();
      return template.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  updateTemplate: async (templateId, templateData) => {
    const {
      title,
      description,
      topic_id,
      image_url,
      is_public,
      tags,
      questions,
      access_users,
    } = templateData;
    const transaction = await models.sequelize.transaction();
    try {
      const template = await Template.findByPk(templateId, { transaction });
      // Update basic template info
      await template.update(
        {
          title,
          description,
          template_topic_id: topic_id,
          image_url,
          is_public,
        },
        { transaction }
      );

      // Handle tags
      if (tags !== undefined) {
        const uniqueTags = Array.isArray(tags)
          ? [...new Set(tags.map((tag) => tag.toLowerCase().trim()))]
          : [];
        const createdTags = await Promise.all(
          uniqueTags.map(async (tagName) => {
            const [tag] = await TemplateTag.findOrCreate({
              where: { name: tagName },
              transaction,
            });
            return tag;
          })
        );
        await template.setTemplateTags(createdTags, { transaction });
      }

      // Handle access control
      if (is_public) {
        await template.setAccessUsers([], { transaction });
      } else if (Array.isArray(access_users)) {
        const users = await User.findAll({
          where: {
            id: [...new Set(access_users)],
            is_blocked: false,
          },
          transaction,
        });
        await template.setAccessUsers(users, { transaction });
      }

      // Handle questions
      if (Array.isArray(questions)) {
        // Get existing questions for comparison
        const existingQuestions = await TemplateQuestion.findAll({
          where: { template_id: template.id },
          include: [{ model: QuestionOption }],
          transaction,
        });

        // Create a map of existing questions by ID for easier lookup
        const existingQuestionsMap = new Map(
          existingQuestions.map((q) => [q.id, q])
        );

        // Process each question in the update
        await Promise.all(
          questions.map(async (question, index) => {
            const questionData = {
              template_id: template.id,
              question_type_id: question.type_id,
              title: question.title,
              description: question.description,
              display_in_summary: Boolean(question.display_in_summary),
              position: index + 1,
              is_required: Boolean(question.is_required),
            };

            let updatedQuestion;

            if (question.id && existingQuestionsMap.has(question.id)) {
              // Update existing question
              const existingQuestion = existingQuestionsMap.get(question.id);
              await existingQuestion.update(questionData, { transaction });
              updatedQuestion = existingQuestion;
              // Remove from map to track which questions should be deleted
              existingQuestionsMap.delete(question.id);
            } else {
              // Create new question
              updatedQuestion = await TemplateQuestion.create(questionData, {
                transaction,
              });
            }

            // Handle options for single choice (4) and checkbox (5) questions
            if (
              (question.type_id === 4 || question.type_id === 5) &&
              Array.isArray(question.options)
            ) {
              const uniqueOptions = [...new Set(question.options)]
                .map((opt) => opt.trim())
                .filter(Boolean);

              // Get existing options
              const existingOptions = updatedQuestion.QuestionOptions || [];
              const existingOptionsMap = new Map(
                existingOptions.map((opt) => [opt.value, opt])
              );

              // Update or create options
              await Promise.all(
                uniqueOptions.map(async (optionValue) => {
                  if (existingOptionsMap.has(optionValue)) {
                    existingOptionsMap.delete(optionValue);
                  } else {
                    await QuestionOption.create(
                      {
                        template_question_id: updatedQuestion.id,
                        value: optionValue,
                      },
                      { transaction }
                    );
                  }
                })
              );

              // Delete remaining unused options
              if (existingOptionsMap.size > 0) {
                await QuestionOption.destroy({
                  where: {
                    id: Array.from(existingOptionsMap.values()).map(
                      (opt) => opt.id
                    ),
                  },
                  transaction,
                });
              }
            }
          })
        );

        // Delete questions that were not included in the update
        if (existingQuestionsMap.size > 0) {
          await TemplateQuestion.destroy({
            where: {
              id: Array.from(existingQuestionsMap.keys()),
            },
            transaction,
          });
        }
      }

      await transaction.commit();
      return template.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  getTemplateByPk: async (templateId) => {
    const template = await models.Template.findByPk(templateId);
    return template;
  },

  getTemplateById: async (templateId) => {
    const template = await models.Template.findOne({
      where: { id: templateId },
      include: [
        {
          model: TemplateTag,
          through: { attributes: [] },
          attributes: [
            ["id", "id"],
            ["name", "name"],
          ],
        },
        {
          model: TemplateTopic,
          attributes: [
            ["id", "id"],
            ["name", "name"],
          ],
        },
        {
          model: User,
          attributes: [
            ["id", "id"],
            ["username", "username"],
            ["email", "email"],
          ],
        },
        {
          model: User,
          as: "AccessUsers",
          attributes: [
            ["id", "id"],
            ["username", "username"],
            ["email", "email"],
          ],
          through: { attributes: [] },
        },
        {
          model: TemplateQuestion,
          attributes: [
            ["id", "id"],
            ["title", "title"],
            ["description", "description"],
            ["display_in_summary", "display_in_summary"],
            ["position", "position"],
            ["is_required", "is_required"],
          ],
          include: [
            {
              model: QuestionType,
              attributes: [
                ["id", "id"],
                ["name", "name"],
              ],
            },
            {
              model: QuestionOption,
              attributes: [
                ["id", "id"],
                ["value", "value"],
              ],
            },
          ],
          order: [["position", "ASC"]],
        },
      ],
      nest: true,
    });

    if (!template) {
      throw CustomError.notFound("Template not found", 11);
    }

    const plainTemplate = template.get({ plain: true });
    if (plainTemplate.is_public) {
      delete plainTemplate.AccessUsers;
    }
    return plainTemplate;
  },

  deleteTemplate: async (templateId) => {
    await Template.destroy({
      where: {
        id: templateId,
      },
    });
  },

  getPopularTemplates: async (limit = 5) => {
    return await Template.findAll({
      attributes: [
        "id",
        "title",
        "description",
        [
          models.sequelize.literal("COUNT(DISTINCT FilledForms.id)"),
          "form_count",
        ],
        [models.sequelize.col("User.username"), "author"],
      ],
      include: [
        {
          model: FilledForm,
          attributes: [],
        },
        {
          model: User,
          attributes: [],
          as: "User",
        },
      ],
      group: ["Template.id", "User.id"],
      order: [[models.sequelize.literal("form_count"), "DESC"]],
      limit,
      subQuery: false,
      raw: true,
      nest: false,
    });
  },

  getLatestTemplates: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await Template.findAndCountAll({
      attributes: [
        "id",
        "title",
        "description",
        "image_url",
        [models.sequelize.col("User.username"), "author"],
      ],
      include: [
        {
          model: User,
          attributes: [],
          as: "User",
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
      raw: true,
      nest: false,
    });

    return {
      latestTemplates: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  searchTemplates: async (query, page, limit, tagId) => {
    const offset = (page - 1) * limit;

    // Base query parameters
    const queryOptions = {
      attributes: ["id", "title", "description", "image_url"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
      distinct: true,
      order: [["created_at", "DESC"]],
      limit,
      offset,
      subQuery: false,
    };

    // If tagId is provided, add tag filtering
    if (tagId) {
      queryOptions.include.push({
        model: TemplateTag,
        attributes: [],
        through: { attributes: [] },
        where: { id: tagId },
      });
    }

    // Add fulltext search if query is provided
    if (query && query.trim()) {
      const searchQuery = `*${query.trim()}*`;
      queryOptions.where = {
        [Op.or]: [
          sequelize.literal(
            `MATCH(Template.title, Template.description) AGAINST(:searchQuery IN BOOLEAN MODE)`
          ),
          sequelize.literal(`EXISTS (
              SELECT 1 FROM comments
              WHERE comments.template_id = Template.id
              AND MATCH(comments.content) AGAINST(:searchQuery IN BOOLEAN MODE)
            )`),
          sequelize.literal(`EXISTS (
              SELECT 1 FROM template_questions
              WHERE template_questions.template_id = Template.id
              AND MATCH(template_questions.title, template_questions.description) AGAINST(:searchQuery IN BOOLEAN MODE)
            )`),
        ],
      };
      queryOptions.replacements = { searchQuery };
    }

    const searchResults = await Template.findAndCountAll(queryOptions);

    return {
      templates: searchResults.rows.map((template) => ({
        id: template.id,
        title: template.title,
        description: template.description,
        image_url: template.image_url,
        author: template.User.username,
      })),
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalTemplates: searchResults.count,
        totalPages: Math.ceil(searchResults.count / limit),
      },
    };
  },
};

export default templateService;
