import { v4 as uuid } from "uuid";
import { createProductValidation, updateProductValidation } from "../validation/product-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { validate } from "../validation/validation.js";

const createProduct = async (body) => {
    const product = validate(createProductValidation, body);


    const existingProduct = await prismaClient.product.findFirst({
        where: { name: product.name }
    });

    if (existingProduct) {
        throw new ResponseError(400, "Product already exists");
    }


    const newProduct = await prismaClient.product.create({
        data: product,
        select: {
            product_id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true,
            isFeatured: true,
            isNew: true,
            category_id: true,
            created_by_id: true
        }
    });

    return {
        success: true,
        message: "Product created successfully",
        data: newProduct
    };
};




const getListProduct = async (query) => {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const search = query.search || "";
    const skip = (page - 1) * pageSize;

    const isFeaturedParam = query.isFeatured;
    const categoryIdParam = query.categoryId;

    const whereClause = {
        name: {
            contains: search,
        },
    };

    if (isFeaturedParam !== undefined) {
        whereClause.isFeatured = isFeaturedParam === 'true';
    }

    if (categoryIdParam !== undefined) {
        whereClause.category_id = categoryIdParam;
    }

    const [productsRaw, total] = await Promise.all([
        prismaClient.product.findMany({
            where: whereClause,
            skip: skip,
            take: pageSize,
            orderBy: {
                name: "asc",
            },
            select: {
                product_id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                image_url: true,
                isFeatured: true,
                isNew: true,
                category_id: true,
                created_by_id: true
            }
        }),
        prismaClient.product.count({
            where: whereClause
        })
    ]);

    const baseUrl = process.env.BASE_URL;

    const products = productsRaw.map((product) => ({
        ...product,
        image_url: product.image_url
            ? `${baseUrl}${product.image_url}`
            : null,
    }));

    return {
        success: true,
        message: "List product fetched successfully",
        data: {
            products,
            total,
            page,
            pageSize
        }
    };
};



const getProductById = async (productId) => {
    const product = await prismaClient.product.findUnique({
        where: {
            product_id: productId,
        },
        select: {
            product_id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true,
            isFeatured: true,
            isNew: true,
            category_id: true,
            created_by_id: true,
        },
    });

    if (!product) {
        throw new ResponseError(404, "Product not found");
    }

    return {
        success: true,
        message: "Product retrieved successfully",
        data: {
            ...product,
            image_url: product.image_url
                ? `${process.env.BASE_URL}${product.image_url}`
                : null,
        },
    };
};

const updateProduct = async (productId, body) => {

    const product = validate(updateProductValidation, body);

    const existingProduct = await prismaClient.product.findUnique({
        where: { product_id: productId },
    });

    if (!existingProduct) {
        throw new ResponseError(404, "Product not found");
    }

    const updatedProduct = await prismaClient.product.update({
        where: { product_id: productId },
        data: product,
        select: {
            product_id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true,
            isFeatured: true,
            isNew: true,
            category_id: true,
            created_by_id: true
        }
    });

    return {
        success: true,
        message: "Product updated successfully",
        data: updatedProduct
    };
};

const deleteProduct = async (productId) => {
    const existingProduct = await prismaClient.product.findUnique({
        where: { product_id: productId },
    });

    if (!existingProduct) {
        throw new ResponseError(404, "Product not found");
    }

    await prismaClient.product.delete({
        where: { product_id: productId },
    });

    return {
        success: true,
        message: "Product deleted successfully",
    };
};



export default { createProduct, getListProduct, getProductById, updateProduct, deleteProduct };