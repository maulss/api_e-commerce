import Joi from "joi";


const addItemToCartValidation = Joi.object({
    product_id: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    user_id: Joi.string().required()
});

const getCartValidation = Joi.object({
    user_id: Joi.string().required()
});

const updateCartItemValidation = Joi.object({
    quantity: Joi.number().integer().min(1).required(),
    user_id: Joi.string().required()
});



export {
    addItemToCartValidation, getCartValidation, updateCartItemValidation
}