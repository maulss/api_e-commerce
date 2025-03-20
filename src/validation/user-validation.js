import Joi from "joi";

const registerUserValidation = Joi.object({
    // user_id: Joi.string().max(100).required(),
    name: Joi.string().max(100).optional(),
    email: Joi.string().max(100).email().required(),
    password: Joi.string().max(100).required(),
    phone_number: Joi.string().max(100).required(),
    address: Joi.string().max(100).optional(),
    role: Joi.string(),
})

const loginUserValidation = Joi.object({
    email: Joi.string().max(100).email().required(),
    password: Joi.string().max(100).required(),
})

const getUserValidation = Joi.object({
    user_id: Joi.string().max(100).required(),
});

const updateUserValidation = Joi.object({
    name: Joi.string().max(100).optional(),
    email: Joi.string().max(100).email().optional(),
    phone_number: Joi.string().max(100).optional(),
    address: Joi.string().max(100).optional(),
})

export { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation };