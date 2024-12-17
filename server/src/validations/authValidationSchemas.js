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
