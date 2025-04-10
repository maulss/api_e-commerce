import { prismaClient } from "../application/database.js";
import { createCategoryValidation } from "../validation/category-validation.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";

const createCategory = async (data) => {
    const category = validate(createCategoryValidation, data);

    const existingCategory = await prismaClient.category.findFirst({
        where: { name: category.name }
    });

    if (existingCategory) {
        throw new ResponseError(400, "Category already exists");
    }

    const newCategory = await prismaClient.category.create({
        data: {
            category_id: category.category_id,
            name: category.name,
            description: category.description,
        },
        select: {
            category_id: true,
            name: true,
            description: true,
        }
    });

    return {
        success: true,
        message: "Category created successfully",
        data: newCategory
    };
}

export default {
    createCategory
}