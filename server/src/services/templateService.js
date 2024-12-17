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
      access_users
    } = templateData;

    const connection = await database.getConnection();

    try {
      await connection.beginTransaction();

      const [templateResult] = await connection.query(
        `INSERT INTO templates 
        (user_id, title, description, topic_id, image_url, is_public) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, title, description, topic_id, image_url, is_public]
      );
      const templateId = templateResult.insertId;

      if (tags && tags.length > 0) {
        const tagIds = await Promise.all(
          tags.map(async (tagName) => {
            const [existingTag] = await connection.query(
              'INSERT INTO template_tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
              [tagName]
            );
            return existingTag.insertId;
          })
        );


        await connection.query(
          'INSERT INTO template_tag_mapping (template_id, tag_id) VALUES ?',
          [tagIds.map(tagId => [templateId, tagId])]
        );
      }


      if (!is_public && access_users && access_users.length > 0) {
        await connection.query(
          'INSERT INTO template_access_control (template_id, user_id) VALUES ?',
          [access_users.map(userId => [templateId, userId])]
        );
      }


      if (questions && questions.length > 0) {
        const questionInserts = questions.map((question, index) => [
          templateId,
          question.type_id,
          question.title,
          question.description,
          question.display_in_summary || false,
          index + 1,  
          question.is_required || false
        ]);

        const [questionsResult] = await connection.query(
          `INSERT INTO template_questions 
          (template_id, type_id, title, description, display_in_summary, position, is_required) 
          VALUES ?`,
          [questionInserts]
        );


        const questionOptionInserts = [];
        questions.forEach((question, index) => {
          if (question.options && question.options.length > 0) {
            question.options.forEach(option => {
              questionOptionInserts.push([
                questionsResult.insertId + index,
                option
              ]);
            });
          }
        });

        if (questionOptionInserts.length > 0) {
          await connection.query(
            'INSERT INTO question_options (question_id, value) VALUES ?',
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

  getTemplateById: async (templateId, userId) => {
    const [templateRows] = await database.query(
      `SELECT t.*, tt.name as topic_name 
       FROM templates t
       LEFT JOIN template_topics tt ON t.topic_id = tt.id
       WHERE t.id = ?`,
      [templateId]
    );

    if (templateRows.length === 0) {
      throw CustomError.notFound("Template not found");
    }

    const template = templateRows[0];

    // Check template access
    if (!template.is_public) {
      const [accessRows] = await database.query(
        `SELECT 1 FROM template_access_control 
         WHERE template_id = ? AND user_id = ?`,
        [templateId, userId]
      );

      if (accessRows.length === 0) {
        throw CustomError.forbidden("You don't have access to this template");
      }
    }

    // Fetch tags
    const [tags] = await database.query(
      `SELECT tt.name FROM template_tag_mapping ttm
       JOIN template_tags tt ON ttm.tag_id = tt.id
       WHERE ttm.template_id = ?`,
      [templateId]
    );

    // Fetch questions
    const [questions] = await database.query(
      `SELECT tq.*, qt.name as type_name FROM template_questions tq
       JOIN question_types qt ON tq.type_id = qt.id
       WHERE tq.template_id = ? 
       ORDER BY tq.position`,
      [templateId]
    );

    // Fetch question options
    const [questionOptions] = await database.query(
      `SELECT question_id, value FROM question_options
       WHERE question_id IN (?)`,
      [questions.map(q => q.id)]
    );

    // Attach options to questions
    questions.forEach(question => {
      question.options = questionOptions
        .filter(opt => opt.question_id === question.id)
        .map(opt => opt.value);
    });

    return {
      ...template,
      tags: tags.map(tag => tag.name),
      questions
    };
  },

  searchTemplates: async (searchParams, userId) => {
    const {
      search = "",
      topic_id,
      tags = [],
      page = 1,
      limit = 10
    } = searchParams;

    const offset = (page - 1) * limit;
    const conditions = [
      "(t.is_public = TRUE OR t.user_id = ? OR tac.user_id = ?)"
    ];
    const params = [userId, userId];

    if (search) {
      conditions.push("(MATCH(t.title, t.description) AGAINST(? IN BOOLEAN MODE))");
      params.push(`*${search}*`);
    }

    if (topic_id) {
      conditions.push("t.topic_id = ?");
      params.push(topic_id);
    }

    if (tags.length > 0) {
      conditions.push(`
        t.id IN (
          SELECT template_id FROM template_tag_mapping ttm
          JOIN template_tags tt ON ttm.tag_id = tt.id
          WHERE tt.name IN (?)
        )
      `);
      params.push(tags);
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(" AND ")}` 
      : "";

    const [countRows] = await database.query(`
      SELECT COUNT(DISTINCT t.id) as total 
      FROM templates t
      LEFT JOIN template_access_control tac ON t.id = tac.template_id
      ${whereClause}
    `, params);

    const [rows] = await database.query(`
      SELECT DISTINCT 
        t.id, t.title, t.description, t.image_url, 
        u.username as author, tt.name as topic
      FROM templates t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN template_topics tt ON t.topic_id = tt.id
      LEFT JOIN template_access_control tac ON t.id = tac.template_id
      ${whereClause}
      LIMIT ? OFFSET ?
    `, [...params, Number(limit), offset]);

    const totalTemplates = countRows[0].total;
    const totalPages = Math.ceil(totalTemplates / limit);

    return {
      templates: rows,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalTemplates,
        totalPages
      }
    };
  }
};

export default templateService;