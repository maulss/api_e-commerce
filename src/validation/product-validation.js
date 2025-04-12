import Joi from "joi";

const createProductValidation = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(255).optional(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    image_url: Joi.string().optional(),
    isFeatured: Joi.boolean().required(),
    isNew: Joi.boolean().required(),
    category_id: Joi.string().required(),
    created_by_id: Joi.string().required()
});

const updateProductValidation = Joi.object({
    name: Joi.string().max(100).optional(),
    description: Joi.string().max(255).optional(),
    price: Joi.number().positive().optional(),
    stock: Joi.number().integer().min(0).optional(),
    image_url: Joi.string().optional(),
    isFeatured: Joi.boolean().required(),
    isNew: Joi.boolean().required(),
    category_id: Joi.string().optional()
});



export { createProductValidation, updateProductValidation };