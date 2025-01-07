import Joi from "joi";

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

export const templateSearchSchema = Joi.object({
  search: Joi.string().trim().max(100).optional().messages({
    "string.max": '"search" must not exceed 100 characters',
    "string.base": '"search" must be a string',
  }),

  order: Joi.string()
    .valid("asc", "desc", "ASC", "DESC")
    .default("DESC")
    .optional()
    .messages({
      "any.only": '"order" must be one of: asc, desc, ASC, DESC',
      "string.base": '"order" must be a string',
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

export const formSearchSchema = Joi.object({
  search: Joi.string().trim().max(100).optional().messages({
    "string.max": '"search" must not exceed 100 characters',
    "string.base": '"search" must be a string',
  }),

  order: Joi.string()
    .valid("asc", "desc", "ASC", "DESC")
    .default("DESC")
    .optional()
    .messages({
      "any.only": '"order" must be one of: asc, desc, ASC, DESC',
      "string.base": '"order" must be a string',
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
