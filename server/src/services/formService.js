import models from "../models/index.js";
import { CustomError } from "../utils/index.js";
import adminService from "./adminService.js";
const {
  FilledForm,
  TemplateQuestion,
  QuestionType,
  ChosenOption,
  FormAnswer,
  QuestionOption,
  sequelize,
  User,
  Template,
} = models;

const formService = {
  createForm: async (userId, templateId, answers) => {
    const transaction = await models.sequelize.transaction();

    try {
      // Create filled form record
      const filledForm = await FilledForm.create(
        {
          user_id: userId,
          template_id: templateId,
        },
        { transaction }
      );

      // Get all questions for validation
      const questions = await TemplateQuestion.findAll({
        where: { template_id: templateId },
        attributes: ["id", "question_type_id"],
        include: [
          {
            model: models.QuestionType,
            attributes: ["id", "name"],
          },
        ],
        raw: true,
      });

      // Process each answer
      for (const answer of answers) {
        if (!answer.question_id) {
          throw CustomError.badRequest("Missing question_id in answer data");
        }

        const question = questions.find((q) => q.id === answer.question_id);
        if (!question) {
          throw CustomError.badRequest(
            `Question ${answer.question_id} not found in template ${templateId}`
          );
        }

        // Create base answer record
        const formAnswer = await FormAnswer.create(
          {
            filled_form_id: filledForm.id,
            template_question_id: answer.question_id,
          },
          { transaction }
        );

        // Store value based on question type
        switch (question["QuestionType.id"]) {
          case 1: // single_line
            await formAnswer.update(
              { string_value: answer.value },
              { transaction }
            );
            break;
          case 2: // multi_line
            await formAnswer.update(
              { text_value: answer.value },
              { transaction }
            );
            break;
          case 3: // integer
            await formAnswer.update(
              { integer_value: parseInt(answer.value) },
              { transaction }
            );
            break;
          case 4: // checkbox
            // Create chosen options for each selected option
            if (Array.isArray(answer.value)) {
              await Promise.all(
                answer.value.map((optionId) =>
                  ChosenOption.create(
                    {
                      form_answer_id: formAnswer.id,
                      question_option_id: optionId,
                    },
                    { transaction }
                  )
                )
              );
            }
            break;
          case 5: // single_choice
            if (answer.value) {
              await ChosenOption.create(
                {
                  form_answer_id: formAnswer.id,
                  question_option_id: answer.value,
                },
                { transaction }
              );
            }
            break;
          default:
            throw CustomError.badRequest(
              `Unsupported question type: ${question["QuestionType.id"]}`
            );
        }
      }

      await transaction.commit();
      return filledForm.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  updateFilledForm: async (userId, formId, answers) => {
    const transaction = await models.sequelize.transaction();
    try {
      const filledForm = await FilledForm.findByPk(formId, {
        include: [
          {
            model: Template,
            include: [
              {
                model: TemplateQuestion,
                attributes: ["id", "question_type_id", "is_required"],
                include: [
                  {
                    model: QuestionType,
                    attributes: ["id", "name"],
                  },
                ],
              },
            ],
          },
          {
            model: User,
            attributes: ["id", "is_admin"],
          },
        ],
      });

      if (!filledForm) {
        throw new Error(`Filled form ${formId} not found`);
      }

      // Check if user has permission to update
      const isOwner = filledForm.user_id === userId;
      const isAdmin = await adminService.isAdmin(userId);

      if (!isOwner && !isAdmin) {
        throw CustomError.forbidden(
          "Unauthorized: User does not have permission to update this form"
        );
      }

      // Get existing answers to clean up
      const existingAnswers = await FormAnswer.findAll({
        where: { filled_form_id: formId },
        include: [
          {
            model: ChosenOption,
          },
        ],
      });

      // Delete existing answers and their chosen options
      for (const existingAnswer of existingAnswers) {
        if (existingAnswer.ChosenOptions?.length > 0) {
          await ChosenOption.destroy({
            where: { form_answer_id: existingAnswer.id },
            transaction,
          });
        }
        await existingAnswer.destroy({ transaction });
      }

      // Create new answers
      const questions = filledForm.Template.TemplateQuestions;

      // Validate that all required questions are answered
      const requiredQuestions = questions.filter((q) => q.is_required);
      for (const required of requiredQuestions) {
        const answer = answers.find((a) => a.question_id === required.id);
        if (
          !answer ||
          answer.value === undefined ||
          answer.value === null ||
          answer.value === ""
        ) {
          throw CustomError.badRequest(
            `Required question ${required.id} must be answered`
          );
        }
      }

      // Process each answer
      for (const answer of answers) {
        if (!answer.question_id) {
          throw CustomError.badRequest("Missing question_id in answer data");
        }

        const question = questions.find((q) => q.id === answer.question_id);
        if (!question) {
          throw CustomError.badRequest(
            `Question ${answer.question_id} not found in template ${filledForm.template_id}`
          );
        }

        // Skip if the question is not required and the value is empty
        if (
          !question.is_required &&
          (answer.value === undefined ||
            answer.value === null ||
            answer.value === "")
        ) {
          continue;
        }

        // Create base answer record
        const formAnswer = await FormAnswer.create(
          {
            filled_form_id: filledForm.id,
            template_question_id: answer.question_id,
          },
          { transaction }
        );

        // Store value based on question type
        switch (
          question.QuestionType.id // Fixed association access
        ) {
          case 1: // single_line
            await formAnswer.update(
              { string_value: answer.value },
              { transaction }
            );
            break;
          case 2: // multi_line
            await formAnswer.update(
              { text_value: answer.value },
              { transaction }
            );
            break;
          case 3: // integer
            await formAnswer.update(
              { integer_value: parseInt(answer.value) },
              { transaction }
            );
            break;
          case 4: // checkbox
            // Create chosen options for each selected option
            if (Array.isArray(answer.value) && answer.value.length > 0) {
              await Promise.all(
                answer.value.map((optionId) =>
                  ChosenOption.create(
                    {
                      form_answer_id: formAnswer.id,
                      question_option_id: optionId,
                    },
                    { transaction }
                  )
                )
              );
            }
            break;
          case 5: // single_choice
            if (answer.value) {
              await ChosenOption.create(
                {
                  form_answer_id: formAnswer.id,
                  question_option_id: answer.value,
                },
                { transaction }
              );
            }
            break;
          default:
            throw CustomError.badRequest(
              `Unsupported question type: ${question.QuestionType.id}`
            );
        }
      }

      await transaction.commit();
      return formId;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  getFilledForm: async (formId, userId) => {
    const isAdmin = await adminService.isAdmin(userId);
    const filledForm = await FilledForm.findByPk(formId, {
      include: [
        {
          model: User,
          attributes: ["id"],
        },
        {
          model: Template,
          attributes: ["id", "user_id"],
          include: [
            {
              model: User,
              as: "AccessUsers",
              attributes: ["id"],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: FormAnswer,
          include: [
            {
              model: TemplateQuestion,
              include: [
                {
                  model: QuestionType,
                },
              ],
            },
            {
              model: ChosenOption,
              include: [
                {
                  model: QuestionOption,
                  attributes: ["id", "value"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!filledForm) {
      throw CustomError.notFound("Form not found", 404);
    }

    // Check access permissions
    if (
      !isAdmin &&
      filledForm.User.id !== userId &&
      filledForm.Template.user_id !== userId
    ) {
      throw CustomError.conflict("Not authorized to access this form", 75);
    }

    // Format the response
    const initialValues = {};
    for (const answer of filledForm.FormAnswers) {
      const questionType = answer.TemplateQuestion.QuestionType.id;
      const fieldName = `question_${answer.TemplateQuestion.id}`;

      switch (questionType) {
        case 1: // single_line
          initialValues[fieldName] = answer.string_value || "";
          break;
        case 2: // multi_line
          initialValues[fieldName] = answer.text_value || "";
          break;
        case 3: // integer
          initialValues[fieldName] = answer.integer_value || "";
          break;
        case 4: // checkbox
          initialValues[fieldName] = answer.ChosenOptions.map(
            (opt) => opt.QuestionOption.value
          );
          break;
        case 5: // single_choice
          initialValues[fieldName] =
            answer.ChosenOptions[0]?.QuestionOption.value || "";
          break;
      }
    }

    return {
      id: filledForm.id,
      created_at: filledForm.created_at,
      initialValues,
    };
  },

  hasUserFilledForm: async (userId, templateId) => {
    const filledForm = await FilledForm.findOne({
      where: {
        user_id: userId,
        template_id: templateId,
      },
      attributes: ["id"],
    });

    return !!filledForm;
  },

  getUserForm: async (userId, templateId) => {
    const filledForm = await FilledForm.findOne({
      where: {
        user_id: userId,
        template_id: templateId,
      },
      attributes: ["id"],
    });

    return filledForm;
  },
};

export default formService;
