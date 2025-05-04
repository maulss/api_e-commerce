import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validation.js";
import { ResponseError } from "../error/response-error.js";
import { cancelOrderValidation, createOrderValidation, updateOrderStatusValidation } from "../validation/order-validation.js";

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

    return {
        success: true,
        message: "Order created successfully",
        data: order,
    }
};


const getUserOrders = async (user_id, status) => {
    const whereClause = { user_id };

    if (status) {
        whereClause.status = status;
    }

    const orders = await prismaClient.order.findMany({
        where: whereClause,
        include: {
            order_items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    const url = process.env.BASE_URL;

    const modifiedOrders = orders.map(order => ({
        ...order,
        order_items: order.order_items.map(item => ({
            ...item,
            product: {
                ...item.product,
                image_url: item.product.image_url
                    ? `${url}${item.product.image_url}`
                    : null
            }
        }))
    }));

    return {
        success: true,
        message: "Orders retrieved successfully",
        data: modifiedOrders,
    };
};




const getOrderDetail = async (order_id, user_id) => {
    const order = await prismaClient.order.findFirst({
        where: {
            order_id,
            user_id
        },
        include: {
            order_items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        throw new ResponseError(404, "Order not found");
    }

    const url = process.env.BASE_URL;

    // Modify image_url for each order item
    const modifiedOrder = {
        ...order,
        order_items: order.order_items.map(item => ({
            ...item,
            product: {
                ...item.product,
                image_url: item.product.image_url
                    ? `${url}${item.product.image_url}`
                    : null
            }
        }))
    };

    return {
        success: true,
        message: "Order retrieved successfully",
        data: modifiedOrder,
    };
};


// const updateOrderStatus = async (order_id, status) => {
//     validate(updateOrderStatusValidation, { status });

//     const existing = await prismaClient.order.findUnique({
//         where: { order_id }
//     });

//     if (!existing) {
//         throw new ResponseError(404, "Order not found");
//     }

//     const updated = await prismaClient.order.update({
//         where: { order_id },
//         data: { status }
//     });

//     return {
//         success: true,
//         message: "Order status updated successfully",
//         data: updated,
//     };
// };

const updateOrderStatus = async (order_id, status) => {
    validate(updateOrderStatusValidation, { status });

    const existing = await prisma.order.findUnique({
        where: { order_id }
    });

    if (!existing) {
        throw new ResponseError(404, "Order not found");
    }

    // Jika status diubah menjadi "cancelled", kembalikan stok produk
    if (status === "cancelled") {
        // Update stok produk
        for (const item of existing.order_items) {
            await prisma.product.update({
                where: { product_id: item.product_id },
                data: { stock: { increment: item.quantity } }
            });
        }
    }

    const updated = await prisma.order.update({
        where: { order_id },
        data: { status }
    });

    return {
        success: true,
        message: "Order status updated successfully",
        data: updated,
    };
};

// const cancelOrder = async (order_id, user_id) => {
//     validate(cancelOrderValidation, { order_id, user_id });

//     const existingOrder = await prismaClient.order.findFirst({
//         where: { order_id, user_id }
//     });

//     if (!existingOrder) {
//         throw new ResponseError(404, "Order not found");
//     }

//     if (existingOrder.status !== "waiting_payment") {
//         throw new ResponseError(400, "Only orders with status 'waiting_payment' can be cancelled");
//     }

//     await prismaClient.order.update({
//         where: { order_id },
//         data: { status: "cancelled" }
//     });

//     return {
//         success: true,
//         message: "Order cancelled successfully"
//     };
// };

const cancelOrder = async (order_id, user_id) => {
    validate(cancelOrderValidation, { order_id, user_id });

    const existingOrder = await prismaClient.order.findFirst({
        where: { order_id, user_id }
    });

    if (!existingOrder) {
        throw new ResponseError(404, "Order not found");
    }

    if (existingOrder.status !== "waiting_payment") {
        throw new ResponseError(400, "Only orders with status 'waiting_payment' can be cancelled");
    }

    // Mengembalikan stok produk jika status dibatalkan
    for (const item of existingOrder.order_items) {
        await prismaClient.product.update({
            where: { product_id: item.product_id },
            data: { stock: { increment: item.quantity } }
        });
    }

    // Update status pesanan menjadi "cancelled"
    await prismaClient.order.update({
        where: { order_id },
        data: { status: "cancelled" }
    });

    return {
        success: true,
        message: "Order cancelled successfully"
    };
};


export default {
    createOrder, getUserOrders, getOrderDetail, updateOrderStatus, cancelOrder
}