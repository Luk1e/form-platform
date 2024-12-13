import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.empty": '"Username" cannot be empty',
    "string.min": '"Username" should have a minimum length of {#limit}',
    "string.max": '"Username" should have a maximum length of {#limit}',
    "any.required": '"Username" is a required field',
  }),

  email: Joi.string().email().required().messages({
    "string.empty": '"Email" cannot be empty',
    "string.email": '"Email" must be a valid email address',
    "any.required": '"Email" is a required field',
  }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.base": '"Password" should be a type of string',
      "string.empty": '"Password" cannot be empty',
      "string.pattern.base":
        '"Password" must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character',
      "any.required": '"Password" is a required field',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": '"Email" cannot be empty',
    "string.email": '"Email" must be a valid email address',
    "any.required": '"Email" is a required field',
  }),

  password: Joi.string().required().messages({
    "string.empty": '"Password" cannot be empty',
    "any.required": '"Password" is a required field',
  }),
});

export const bulkUserOperationSchema = Joi.object({
  userIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
    .messages({
      "array.min": '"userIds" must contain at least one user ID',
      "number.positive": '"userIds" must contain only positive integers',
      "any.required": '"userIds" is a required field',
    }),
});

export const userSearchSchema = Joi.object({
  search: Joi.string().trim().max(100).optional().messages({
    "string.max": '"search" must not exceed 100 characters',
    "string.base": '"search" must be a string',
  }),
  is_admin: Joi.string().valid("true", "false").optional().messages({
    "any.only": '"is_admin" must be either "true" or "false"',
    "string.base": '"is_admin" must be a string',
  }),
  is_blocked: Joi.string().valid("true", "false").optional().messages({
    "any.only": '"is_blocked" must be either "true" or "false"',
    "string.base": '"is_blocked" must be a string',
  }),
  page: Joi.number().integer().min(1).default(1).optional().messages({
    "number.base": '"page" must be a number',
    "number.integer": '"page" must be an integer',
    "number.min": '"page" must be at least 1',
  }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .optional()
    .messages({
      "number.base": '"limit" must be a number',
      "number.integer": '"limit" must be an integer',
      "number.min": '"limit" must be at least 1',
      "number.max": '"limit" must not exceed 100',
    }),
});
