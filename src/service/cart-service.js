import { ResponseError } from "../error/response-error.js";
import { addItemToCartValidation, getCartValidation } from "../validation/cart-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";


const addItemToCart = async ({ user_id, product_id, quantity }) => {
    validate(addItemToCartValidation, { user_id, product_id, quantity });

    const product = await prismaClient.product.findUnique({
        where: { product_id }
    });

    if (!product) throw new ResponseError(404, "Product not found");
    if (product.stock < quantity) throw new ResponseError(400, "Insufficient stock");

    const existingCartItem = await prismaClient.cartItem.findFirst({
        where: { user_id, product_id }
    });

    if (existingCartItem) {
        await prismaClient.cartItem.update({
            where: { cart_item_id: existingCartItem.cart_item_id },
            data: {
                quantity: existingCartItem.quantity + quantity
            }
        });
    } else {
        await prismaClient.cartItem.create({
            data: {
                user_id,
                product_id,
                quantity
            }
        });
    }

    return {
        success: true,
        message: "Item added to cart"
    };
};

const getCart = async (user_id) => {
    validate(getCartValidation, { user_id });

    const items = await prismaClient.cartItem.findMany({
        where: { user_id },
        include: {
            product: true
        }
    });

    const total_price = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
    const total_quantity = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
        cart_id: `cart-${user_id}`,
        user_id,
        items: items.map(item => ({
            cart_item_id: item.cart_item_id,
            quantity: item.quantity,
            product: item.product,
            total_price: item.quantity * item.product.price
        })),
        total_price,
        total_quantity
    };
};

export default {
    addItemToCart, getCart
};