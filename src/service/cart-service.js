import { ResponseError } from "../error/response-error.js";
import { addItemToCartValidation, getCartValidation, updateCartItemValidation } from "../validation/cart-validation.js";
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
        success: true,
        message: "Cart retrieved successfully",
        data: {
            cart_id: `cart-${user_id}`,
            user_id,
            items: items.map(item => ({
                cart_item_id: item.cart_item_id,
                quantity: item.quantity,
                product: {
                    ...item.product,
                    image_url: item.product.image_url
                        ? `${process.env.BASE_URL}${item.product.image_url}`
                        : null
                },
                total_price: item.quantity * item.product.price
            })),
            total_price,
            total_quantity
        }
    };
};

// const updateCartItem = async (cart_item_id, { user_id, quantity }) => {
//     validate(updateCartItemValidation, { user_id, quantity });

//     const cartItem = await prismaClient.cartItem.findUnique({
//         where: { cart_item_id }
//     });

//     if (!cartItem || cartItem.user_id !== user_id) {
//         throw new ResponseError(404, "Cart item not found");
//     }

//     await prismaClient.cartItem.update({
//         where: { cart_item_id },
//         data: { quantity }
//     });

//     return {
//         success: true,
//         message: "Cart item updated"
//     };
// };

const updateCartItem = async (cart_item_id, { user_id, quantity }) => {
    validate(updateCartItemValidation, { user_id, quantity });

    const cartItem = await prismaClient.cartItem.findUnique({
        where: { cart_item_id },
        include: { product: true }
    });

    if (!cartItem || cartItem.user_id !== user_id) {
        throw new ResponseError(404, "Cart item not found");
    }

    if (!cartItem.product) {
        throw new ResponseError(404, "Product not found");
    }


    if (quantity > cartItem.product.stock) {
        throw new ResponseError(400, `Quantity exceeds available stock (${cartItem.product.stock})`);
    }

    await prismaClient.cartItem.update({
        where: { cart_item_id },
        data: { quantity }
    });

    return {
        success: true,
        message: "Cart item updated"
    };
};


const deleteCartItem = async (cart_item_id, user_id) => {
    const cartItem = await prismaClient.cartItem.findUnique({
        where: { cart_item_id }
    });

    if (!cartItem || cartItem.user_id !== user_id) {
        throw new ResponseError(404, "Cart item not found");
    }

    await prismaClient.cartItem.delete({
        where: { cart_item_id }
    });

    return {
        success: true,
        message: "Cart item deleted"
    };
};

const deleteCart = async (user_id) => {
    await prismaClient.cartItem.deleteMany({
        where: { user_id }
    });

    return {
        success: true,
        message: "Cart cleared"
    };
};

export default {
    addItemToCart, getCart, updateCartItem, deleteCartItem, deleteCart
};