import { v4 as uuid } from "uuid";
import { createProductValidation } from "../validation/product-validation.js";
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


    if (!product.created_by_id) {
        throw new ResponseError(400, "created_by_id is required");
    }

    if (!product.category_id) {
        throw new ResponseError(400, "category_id is required");
    }


    const newProduct = await prismaClient.product.create({
        data: {
            product_id: uuid(),
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image_url: product.image_url,
            category_id: product.category_id,
            created_by_id: product.created_by_id
        },
        select: {
            product_id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            image_url: true,
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

export default { createProduct };