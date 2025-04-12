import Joi from "joi";

const createCategoryValidation = Joi.object({
    image_url: Joi.string().optional(),
    name: Joi.string().max(100).required(),
    description: Joi.string().max(255).optional(),
    category_id: Joi.string().required()
});

const updateCategoryValidation = Joi.object({
    name: Joi.string().max(100).optional(),
    description: Joi.string().max(255).optional(),
    image_url: Joi.string().optional(),
    category_id: Joi.string().required()
});

export { createCategoryValidation, updateCategoryValidation };