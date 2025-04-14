import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import { createOrderValidation } from "../validation/order-validation.js";

const createOrder = async (user_id) => {
    validate(createOrderValidation, { user_id });

    const cartItems = await prismaClient.cartItem.findMany({
        where: { user_id },
        include: { product: true }
    });

    if (cartItems.length === 0) {
        throw new ResponseError(400, "Cart is empty");
    }

    let total_price = 0;
    for (const item of cartItems) {
        if (item.product.stock < item.quantity) {
            throw new ResponseError(400, `Insufficient stock for ${item.product.name}`);
        }
        total_price += item.quantity * item.product.price;
    }

    const order = await prismaClient.order.create({
        data: {
            user_id,
            total_price,
            status: "waiting_payment",
            order_items: {
                create: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.product.price
                }))
            }
        },
        include: {
            order_items: true
        }
    });

    for (const item of cartItems) {
        await prismaClient.product.update({
            where: { product_id: item.product_id },
            data: { stock: { decrement: item.quantity } }
        });
    }

    await prismaClient.cartItem.deleteMany({
        where: { user_id }
    });

    return order;
};

export default {
    createOrder,
}