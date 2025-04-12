import { prismaClient } from "../application/database.js";
import { createCategoryValidation, updateCategoryValidation } from "../validation/category-validation.js";
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
            image_url: category.image_url,
            description: category.description,
        },
        select: {
            category_id: true,
            name: true,
            image_url: true,
            description: true,
        }
    });

    return {
        success: true,
        message: "Category created successfully",
        data: newCategory
    };
}

const getListCategory = async (query) => {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const search = query.search || "";

    const skip = (page - 1) * pageSize;

    const [categories, total] = await Promise.all([
        prismaClient.category.findMany({
            where: {
                name: {
                    contains: search,
                }
            },
            skip: skip,
            take: pageSize,
            orderBy: {
                name: "asc",
            },
            select: {
                category_id: true,
                name: true,
                image_url: true,
                description: true,
            }
        }),
        prismaClient.category.count({
            where: {
                name: {
                    contains: search,

                }
            }
        })
    ]);

    return {
        success: true,
        message: "Category list retrieved successfully",
        data: {
            categories,
            total,
            page,
            pageSize
        },
    };
}

const updateCategory = async (categoryId, data) => {
    const categoryData = validate(updateCategoryValidation, data);

    const existingCategory = await prismaClient.category.findUnique({
        where: { category_id: categoryId },
    });

    if (!existingCategory) {
        throw new ResponseError(404, "Category not found");
    }

    const updatedCategory = await prismaClient.category.update({
        where: { category_id: categoryId },
        data: categoryData,
        select: {
            category_id: true,
            name: true,
            description: true,
            image_url: true,
        },
    });

    return {
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
    };
};

const deleteCategory = async (categoryId) => {
    const existingCategory = await prismaClient.category.findUnique({
        where: { category_id: categoryId },
    });

    if (!existingCategory) {
        throw new ResponseError(404, "Category not found");
    }

    await prismaClient.category.delete({
        where: { category_id: categoryId },
    });

    return {
        success: true,
        message: "Category deleted successfully",
    };
}

export default {
    createCategory, getListCategory, updateCategory, deleteCategory
}