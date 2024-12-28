import database from "../../config/database.js";
import { CustomError } from "../utils/index.js";

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

    const connection = await database.getConnection();

    try {
      await connection.beginTransaction();

      // Create template
      const [templateResult] = await connection.query(
        `INSERT INTO templates 
        (user_id, title, description, topic_id, image_url, is_public) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, title, description, topic_id, image_url, is_public]
      );
      const templateId = templateResult.insertId;

      // Handle tags
      if (tags && tags.length > 0) {
        const tagIds = await Promise.all(
          tags.map(async (tagName) => {
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

      // Handle access control for private templates
      if (!is_public && access_users && access_users.length > 0) {
        await connection.query(
          "INSERT INTO template_access_control (template_id, user_id) VALUES ?",
          [access_users.map((accessUserId) => [templateId, accessUserId])]
        );
      }

      // Handle questions
      if (questions && questions.length > 0) {
        const questionInserts = questions.map((question, index) => [
          templateId,
          question.type_id,
          question.title,
          question.description,
          question.display_in_summary || false,
          index + 1,
          question.is_required || false,
        ]);

        const [questionsResult] = await connection.query(
          `INSERT INTO template_questions 
          (template_id, type_id, title, description, display_in_summary, position, is_required) 
          VALUES ?`,
          [questionInserts]
        );

        const questionOptionInserts = [];
        questions.forEach((question, index) => {
          if (
            (question.type_id === 4 || question.type_id === 5) &&
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
      return templateId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
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
    const [rows] = await database.query(
      "Select * from templates t where t.id = ?",
      [templateId]
    );
    return rows[0];
  },

  deleteTemplate: async (templateId) => {
    await database.query("DELETE FROM templates WHERE id = ?", [templateId]);
  },

  getPopularTemplates: async (limit = 5) => {
    const [rows] = await database.query(
      `
      SELECT t.id, t.title, t.description, COUNT(DISTINCT f.id) as form_count, u.username as author
      FROM templates t
      LEFT JOIN filled_forms f ON t.id = f.template_id
      JOIN users u ON t.user_id = u.id
      WHERE t.is_public = TRUE
      GROUP BY t.id, t.title, t.description, u.username
      ORDER BY form_count DESC
      LIMIT ?
    `,
      [limit]
    );
    return rows;
  },

  getLatestTemplates: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    const [[rows], [countResult]] = await Promise.all([
      database.query(
        `SELECT t.id, t.title, t.description, t.image_url, u.username as author
         FROM templates t
         JOIN users u ON t.user_id = u.id
         WHERE t.is_public = TRUE
         ORDER BY t.created_at DESC
         LIMIT ? OFFSET ?`,
        [limit, offset]
      ),
      database.query(
        `SELECT COUNT(*) as total 
         FROM templates t
         WHERE t.is_public = TRUE`
      ),
    ]);

    return {
      latestTemplates: rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(countResult[0].total / limit),
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
