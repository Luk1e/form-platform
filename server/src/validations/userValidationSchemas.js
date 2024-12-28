import Joi from "joi";

export const userTemplatesSearchSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  order: Joi.string().valid("asc", "desc").default("desc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

export const userFormsSearchSchema = Joi.object({
  template_title: Joi.string().max(255).optional(),
  order: Joi.string().valid("asc", "desc").default("desc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});
