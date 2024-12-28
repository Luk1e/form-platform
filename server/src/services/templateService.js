import database from "../../config/database.js";
import { CustomError } from "../utils/index.js";
import models from "../models/index.js";
const {
  User,
  Template,
  TemplateTag,
  FilledForm,
  QuestionOption,
  TemplateQuestion,
} = models;

const templateService = {
  createTemplate: async (userId, templateData) => {
    const {
      title,
      description,
      template_topic_id: topicId,
      image_url,
      is_public,
      tags,
      questions,
      access_users,
    } = templateData;

    const transaction = await models.sequelize.transaction();

    try {
      // Create template
      const template = await Template.create(
        {
          user_id: userId,
          title,
          description,
          template_topic_id: topicId,
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
    const connection = await database.getConnection();

    try {
      await connection.beginTransaction();

      // Update template basic info
      await connection.query(
        `UPDATE templates 
         SET title = ?, description = ?, topic_id = ?, image_url = ?, is_public = ?
         WHERE id = ?`,
        [
          templateData.title,
          templateData.description,
          templateData.topic_id,
          templateData.image_url,
          templateData.is_public,
          templateId,
        ]
      );

      // Update tags
      await connection.query(
        "DELETE FROM template_tag_mapping WHERE template_id = ?",
        [templateId]
      );

      if (templateData.tags && templateData.tags.length > 0) {
        const tagIds = await Promise.all(
          templateData.tags.map(async (tagName) => {
            const [existingTag] = await connection.query(
              "INSERT INTO template_tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",
              [tagName.toLowerCase().trim()]
            );
            return existingTag.insertId;
          })
        );

        await connection.query(
          "INSERT INTO template_tag_mapping (template_id, tag_id) VALUES ?",
          [tagIds.map((tagId) => [templateId, tagId])]
        );
      }

      // Update access control
      await connection.query(
        "DELETE FROM template_access_control WHERE template_id = ?",
        [templateId]
      );

      if (
        !templateData.is_public &&
        templateData.access_users &&
        templateData.access_users.length > 0
      ) {
        await connection.query(
          "INSERT INTO template_access_control (template_id, user_id) VALUES ?",
          [templateData.access_users.map((userId) => [templateId, userId])]
        );
      }

      // Update questions
      await connection.query(
        "DELETE FROM template_questions WHERE template_id = ?",
        [templateId]
      );

      if (templateData.questions && templateData.questions.length > 0) {
        const questionInserts = templateData.questions.map(
          (question, index) => [
            templateId,
            question.type_id,
            question.title,
            question.description,
            question.display_in_summary || false,
            index + 1,
            question.is_required || false,
          ]
        );

        const [questionsResult] = await connection.query(
          `INSERT INTO template_questions 
          (template_id, type_id, title, description, display_in_summary, position, is_required) 
          VALUES ?`,
          [questionInserts]
        );

        // Handle question options
        const questionOptionInserts = [];
        templateData.questions.forEach((question, index) => {
          if (
            question.type_id === 5 &&
            question.options &&
            question.options.length > 0
          ) {
            question.options.forEach((option) => {
              questionOptionInserts.push([
                questionsResult.insertId + index,
                option,
              ]);
            });
          }
        });

        if (questionOptionInserts.length > 0) {
          await connection.query(
            "INSERT INTO question_options (question_id, value) VALUES ?",
            [questionOptionInserts]
          );
        }
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getTemplateById: async (templateId) => {
    return await Template.findByPk(templateId);
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

  toggleLike: async (templateId, userId) => {
    const [existing] = await database.query(
      "SELECT 1 FROM likes WHERE template_id = ? AND user_id = ?",
      [templateId, userId]
    );

    if (existing.length > 0) {
      await database.query(
        "DELETE FROM likes WHERE template_id = ? AND user_id = ?",
        [templateId, userId]
      );
      return { liked: false };
    } else {
      await database.query(
        "INSERT INTO likes (template_id, user_id) VALUES (?, ?)",
        [templateId, userId]
      );
      return { liked: true };
    }
  },

  addComment: async (templateId, userId, content) => {
    const [result] = await database.query(
      "INSERT INTO comments (template_id, user_id, content) VALUES (?, ?, ?)",
      [templateId, userId, content]
    );

    const [comment] = await database.query(
      `
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `,
      [result.insertId]
    );

    return comment[0];
  },

  getComments: async (templateId) => {
    const [rows] = await database.query(
      `
      SELECT c.*, u.username
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.template_id = ?
      ORDER BY c.created_at ASC
    `,
      [templateId]
    );
    return rows;
  },

  searchTemplatesByTag: async (tag, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const [rows] = await database.query(
      `
      SELECT DISTINCT t.*, u.username as author
      FROM templates t
      JOIN template_tag_mapping ttm ON t.id = ttm.template_id
      JOIN template_tags tt ON ttm.tag_id = tt.id
      JOIN users u ON t.user_id = u.id
      WHERE tt.name = ? AND t.is_public = TRUE
      LIMIT ? OFFSET ?
    `,
      [tag, limit, offset]
    );

    const [countResult] = await database.query(
      `
      SELECT COUNT(DISTINCT t.id) as total
      FROM templates t
      JOIN template_tag_mapping ttm ON t.id = ttm.template_id
      JOIN template_tags tt ON ttm.tag_id = tt.id
      WHERE tt.name = ? AND t.is_public = TRUE
    `,
      [tag]
    );

    return {
      templates: rows,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalTemplates: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit),
      },
    };
  },
};

export default templateService;
