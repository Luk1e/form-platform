import Joi from 'joi';

const personalInfoSchema = {
  firstName: Joi.string().trim().min(2).max(40).required().messages({
    "string.empty": '"First Name" cannot be empty',
    "string.min": '"First Name" must be at least 2 characters long',
    "string.max": '"First Name" must be less than 40 characters',
    "any.required": '"First Name" is a required field',
  }),
  lastName: Joi.string().trim().min(2).max(80).required().messages({
    "string.empty": '"Last Name" cannot be empty',
    "string.min": '"Last Name" must be at least 2 characters long',
    "string.max": '"Last Name" must be less than 80 characters',
    "any.required": '"Last Name" is a required field',
  }),
  email: Joi.string().email().max(80).required().messages({
    "string.empty": '"Email" cannot be empty',
    "string.email": '"Email" must be a valid email address',
    "string.max": '"Email" must be less than 80 characters',
    "any.required": '"Email" is a required field',
  }),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.empty": '"Phone" cannot be empty',
      "string.pattern.base": '"Phone" must be a valid phone number in E.164 format',
      "any.required": '"Phone" is a required field',
    }),
  accountType: Joi.string()
    .valid('personal', 'business')
    .required()
    .messages({
      "string.empty": '"Account Type" cannot be empty',
      "any.only": '"Account Type" must be either "personal" or "business"',
      "any.required": '"Account Type" is a required field',
    })
};

const businessInfoSchema = {
  company: Joi.string()
    .when('accountType', {
      is: 'business',
      then: Joi.string().trim().min(2).max(255).required(),
      otherwise: Joi.forbidden()
    })
    .messages({
      "string.empty": '"Company Name" cannot be empty',
      "string.min": '"Company Name" must be at least 2 characters long',
      "string.max": '"Company Name" must be less than 255 characters',
      "any.required": '"Company Name" is required for business accounts',
      "any.unknown": '"Company Name" is not allowed for personal accounts'
    }),
  
  companyPhone: Joi.string()
    .when('accountType', {
      is: 'business',
      then: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
      otherwise: Joi.forbidden()
    })
    .messages({
      "string.empty": '"Company Phone" cannot be empty',
      "string.pattern.base": '"Company Phone" must be a valid phone number in E.164 format',
      "any.required": '"Company Phone" is required for business accounts',
      "any.unknown": '"Company Phone" is not allowed for personal accounts'
    }),
  
  companyWebsite: Joi.string()
    .when('accountType', {
      is: 'business',
      then: Joi.string().uri({
        scheme: ['http', 'https']
      }).allow('').optional(),
      otherwise: Joi.forbidden()
    })
    .messages({
      "string.uri": '"Company Website" must be a valid URL starting with http:// or https://',
      "any.unknown": '"Company Website" is not allowed for personal accounts'
    })
};

export const salesforceAccountSchema = Joi.object({
  ...personalInfoSchema,
  ...businessInfoSchema
})