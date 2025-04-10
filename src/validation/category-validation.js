import Joi from "joi";

const createCategoryValidation = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(255).optional(),
    category_id: Joi.string().required()
});

export { createCategoryValidation };