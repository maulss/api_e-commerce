import { prismaClient } from "../application/database.js";
import midtrans from "../application/midtrans.js";
import { ResponseError } from "../error/response-error.js";

const createPaymentTransaction = async (order_id) => {

    if (!order_id) {
        throw new ResponseError(400, "Order ID is required");
    }

    const order = await prismaClient.order.findUnique({
        where: { order_id },
        include: {
            order_items: {
                include: {
                    product: true
                }
            },
            user: true
        }
    });

    if (!order) {
        throw new ResponseError(404, "Order not found");
    }


    if (!order.user) {
        throw new ResponseError(404, "User data not found for this order");
    }

    const items = order.order_items.map(item => ({
        id: item.product_id,
        price: item.price,
        quantity: item.quantity,
        name: item.product.name
    }));

    const transactionDetails = {
        order_id: order_id,
        gross_amount: order.total_price,
    };

    const itemDetails = items;

    const customerDetails = {
        first_name: order.user.name,
        email: order.user.email,
        phone: order.user.phone_number,
    };

    try {

        const snapRequest = {
            transaction_details: transactionDetails,
            item_details: itemDetails,
            customer_details: customerDetails,
        };
        const snapResponse = await midtrans.createTransaction(snapRequest);
        return snapResponse;
    } catch (error) {
        console.error("Midtrans Snap Error:", error);
        throw new ResponseError(500, "Payment transaction failed", error.message);
    }
};


export default { createPaymentTransaction };
