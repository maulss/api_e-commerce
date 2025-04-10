import Joi from "joi";

const createProductValidation = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(255).optional(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    image_url: Joi.string().optional(),
    category_id: Joi.string().required(),
    created_by_id: Joi.string().required()
});

export { createProductValidation };