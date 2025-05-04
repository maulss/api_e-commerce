import Joi from "joi";

const createPaymentValidation = Joi.object({
    order_id: Joi.string().max(100).required(),
    payment_method: Joi.string().max(50).required(),
    payment_status: Joi.string().valid("pending", "completed", "failed").optional(),
    name: Joi.string().max(100).optional(),
    email: Joi.string().email().max(100).optional(),
    phone_number: Joi.string().max(50).optional(),
});

export { createPaymentValidation };