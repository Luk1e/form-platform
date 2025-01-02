import Joi from "joi";

export const latestTemplateSearchSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": '"page" must be a number',
    "number.integer": '"page" must be an integer',
    "number.min": '"page" must be at least 1',
  }),
  limit: Joi.number().integer().min(1).optional().default(10).messages({
    "number.base": '"limit" must be a number',
    "number.integer": '"limit" must be an integer',
    "number.min": '"limit" must be at least 1',
  }),
});

export const createTemplateSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    "string.empty": '"Title" cannot be empty',
    "string.min": '"Title" should have a minimum length of {#limit}',
    "string.max": '"Title" should have a maximum length of {#limit}',
    "any.required": '"Title" is a required field',
  }),

  description: Joi.string().max(5000).optional().allow(""),

  topic_id: Joi.number().integer().positive().required().messages({
    "number.base": '"Topic ID" must be a number',
    "number.integer": '"Topic ID" must be an integer',
    "number.positive": '"Topic ID" must be a positive number',
    "any.required": '"Topic ID" is a required field',
  }),

  image_file: Joi.any().optional(),

  is_public: Joi.boolean().required().messages({
    "any.required": '"Is Public" is a required field',
    "boolean.base": '"Is Public" must be a boolean',
  }),

  tags: Joi.array().items(Joi.string().max(50)).optional(),

  access_users: Joi.array()
    .items(Joi.number().integer().positive())
    .when("is_public", {
      is: false,
      then: Joi.array().min(1),
    })
    .optional()
    .messages({
      "array.min": "For private templates, at least one user must be specified",
    }),

  questions: Joi.array()
    .items(
      Joi.object({
        type_id: Joi.number().integer().positive().required(),
        title: Joi.string().min(1).max(255).required(),
        description: Joi.string().max(1000).optional().allow(""),
        display_in_summary: Joi.boolean().optional(),
        is_required: Joi.boolean().optional(),
        options: Joi.alternatives().conditional("type_id", {
          is: Joi.number().valid(4, 5),
          then: Joi.array()
            .items(Joi.string().max(255))
            .min(1)
            .required()
            .messages({
              "array.min":
                "At least one option is required for this question type",
              "array.required": "Options are required for this question type",
              "array.base": "Options must be an array",
              "string.max": "Each option must not exceed 255 characters",
            }),
          otherwise: Joi.array().items(Joi.string().max(255)).optional(),
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one question is required",
    }),
});

export const updateTemplateSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    "string.empty": '"Title" cannot be empty',
    "string.min": '"Title" should have a minimum length of {#limit}',
    "string.max": '"Title" should have a maximum length of {#limit}',
    "any.required": '"Title" is a required field',
  }),

  description: Joi.string().max(5000).optional().allow(""),

  topic_id: Joi.number().integer().positive().required().messages({
    "number.base": '"Topic ID" must be a number',
    "number.integer": '"Topic ID" must be an integer',
    "number.positive": '"Topic ID" must be a positive number',
    "any.required": '"Topic ID" is a required field',
  }),

  image_url: Joi.any(),

  is_public: Joi.boolean().required().messages({
    "any.required": '"Is Public" is a required field',
    "boolean.base": '"Is Public" must be a boolean',
  }),

  tags: Joi.array().items(Joi.string().max(50)).optional(),

  access_users: Joi.array()
    .items(Joi.number().integer().positive())
    .when("is_public", {
      is: false,
      then: Joi.array().min(1),
    })
    .optional()
    .messages({
      "array.min": "For private templates, at least one user must be specified",
    }),

  questions: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        type_id: Joi.number().integer().positive().required(),
        title: Joi.string().min(1).max(255).required(),
        description: Joi.string().max(1000).optional().allow(""),
        display_in_summary: Joi.boolean().optional(),
        is_required: Joi.boolean().optional(),
        options: Joi.alternatives().conditional("type_id", {
          is: Joi.number().valid(4, 5),
          then: Joi.array()
            .items(Joi.string().max(255))
            .min(1)
            .required()
            .messages({
              "array.min":
                "At least one option is required for this question type",
              "array.required": "Options are required for this question type",
              "array.base": "Options must be an array",
              "string.max": "Each option must not exceed 255 characters",
            }),
          otherwise: Joi.array().items(Joi.string().max(255)).optional(),
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one question is required",
    }),
});
