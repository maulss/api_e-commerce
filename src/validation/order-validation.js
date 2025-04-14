import Joi from "joi";

const createOrderValidation = Joi.object({
    user_id: Joi.string().required()
});


export {
    createOrderValidation
}