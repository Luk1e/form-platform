import models from "../models/index.js";
const {
  FilledForm,
  TemplateQuestion,
  QuestionType,
  ChosenOption,
  FormAnswer,
  QuestionOption,
  sequelize,
} = models;

const formService = {
  createFilledForm: async (userId, templateId, answers) => {
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
          throw new Error("Missing question_id in answer data");
        }

        const question = questions.find((q) => q.id === answer.question_id);
        if (!question) {
          throw new Error(
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
            throw new Error(
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

  getFilledForm: async (userId, templateId) => {
    try {
      const filledForm = await FilledForm.findOne({
        where: {
          user_id: userId,
          template_id: templateId,
        },
        include: [
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
        order: [["created_at", "DESC"]],
      });

      if (!filledForm) {
        return null;
      }

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
    } catch (error) {
      console.error("Error retrieving filled form:", error);
      throw error;
    }
  },

  hasUserFilledForm: async (userId, templateId) => {
    try {
      const filledForm = await FilledForm.findOne({
        where: {
          user_id: userId,
          template_id: templateId,
        },
        attributes: ["id"],
      });

      return !!filledForm;
    } catch (error) {
      console.error("Error checking filled form:", error);
      throw error;
    }
  },
};

export default formService;
