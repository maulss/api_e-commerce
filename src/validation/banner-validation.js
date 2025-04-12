import Joi from "joi";

const createBannerValidation = Joi.object({
    title: Joi.string().max(255).required(),
    image_url: Joi.string().required(),
    created_by: Joi.string().required(),
});
export { createBannerValidation };