import Joi from "joi";

const createOrderValidation = Joi.object({
    user_id: Joi.string().required()
});

const updateOrderStatusValidation = Joi.object({
    status: Joi.string().valid(
        "waiting_payment",
        "completed",
        "failed"
    ).required()
});

const cancelOrderValidation = Joi.object({
    order_id: Joi.string().required(),
    user_id: Joi.string().required()
});



export {
    createOrderValidation, updateOrderStatusValidation, cancelOrderValidation
}

