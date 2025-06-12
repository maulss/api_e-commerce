import { prismaClient } from "../application/database.js";
import midtrans from "../application/midtrans.js";
import { ResponseError } from "../error/response-error.js";
import ContractService from "../blockchain/contractService.js";


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


        await prismaClient.order.update({
            where: { order_id },
            data: { payment_url: snapResponse.redirect_url } // <-- Simpan URL pembayaran
        });

        return {
            paymentDetails: snapResponse,
            orderId: order_id
        };
    } catch (error) {
        console.error("Midtrans Snap Error:", error);
        throw new ResponseError(500, "Payment transaction failed", error.message);
    }
};


const handleMidtransNotification = async (notification) => {
    try {
        const orderId = notification.order_id;
        let transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        if (!orderId) {
            throw new ResponseError(400, "Invalid notification: order_id is missing");
        }

        const order = await prismaClient.order.findUnique({
            where: { order_id: orderId },
            include: { user: true },
        });

        if (!order) {
            throw new ResponseError(404, `Order not found: ${orderId}`);
        }

        if (fraudStatus === 'accept') {
        } else if (fraudStatus === 'challenge') {
            transactionStatus = 'challenge';
        } else if (fraudStatus === 'deny') {
            transactionStatus = 'denied';
        }

        let newStatus = order.status;

        if (transactionStatus === 'capture') {
            newStatus = 'paid';
        } else if (transactionStatus === 'settlement') {
            if (order.status !== 'completed') {
                newStatus = 'completed';

                const customerEmail = notification.email || order.user?.email || 'unknown';
                const customerName = order.user?.name || 'unknown';

                const paymentAmount = notification.gross_amount || order.total_price;

                const amountToStore = parseInt(paymentAmount, 10);
                if (isNaN(amountToStore)) {
                    throw new Error(`Invalid amount value: ${paymentAmount}`);
                }

                const blockchainResult = await ContractService.storeTransaction(
                    orderId,
                    amountToStore,
                    transactionStatus,
                    notification.currency || 'IDR',
                    notification.payment_type || 'unknown',
                    customerEmail,
                    'E-shop',
                    customerName
                );

                await prismaClient.order.update({
                    where: { order_id: orderId },
                    data: {
                        transaction_hash: blockchainResult.transactionHash,
                        contract_address: process.env.CONTRACT_ADDRESS,
                    },
                });
            }
        } else if (transactionStatus === 'pending') {
            newStatus = 'waiting_payment';
        } else if (['deny', 'expire', 'cancel'].includes(transactionStatus)) {
            newStatus = 'failed';

            const orderItems = await prismaClient.orderItem.findMany({
                where: { order_id: orderId },
                include: { product: true },
            });

            for (const item of orderItems) {
                await prismaClient.product.update({
                    where: { product_id: item.product_id },
                    data: { stock: { increment: item.quantity } },
                });
            }
        }

        if (newStatus !== order.status) {
            await prismaClient.order.update({
                where: { order_id: orderId },
                data: { status: newStatus },
            });

            if (newStatus === 'completed') {
                // const orderItems = await prismaClient.orderItem.findMany({
                //     where: { order_id: orderId },
                //     include: { product: true },
                // });

                // for (const item of orderItems) {
                //     await prismaClient.product.update({
                //         where: { product_id: item.product_id },
                //         data: { stock: item.product.stock - item.quantity },
                //     });
                // }
            }
        }

        return {
            success: true,
            message: `Order ${orderId} status updated to ${newStatus}`,
            order_id: orderId,
            status: newStatus,
        };
    } catch (error) {
        console.error("Error handling Midtrans notification:", error);
        throw error;
    }
};





const getPaymentStatus = async (orderId) => {
    try {
        const order = await prismaClient.order.findUnique({
            where: { order_id: orderId }
        });

        if (!order) {
            throw new ResponseError(404, `Order not found: ${orderId}`);
        }


        if (order.status) {
            return { status: order.status };
        }


        const midtransStatus = await midtrans.getTransactionStatus(orderId);

        return { status: midtransStatus.transaction_status };
    } catch (error) {
        console.error("Error checking payment status:", error);
        throw error;
    }
};

const getPaymentUrl = async (order_id) => {
    if (!order_id) {
        throw new ResponseError(400, "Order ID is required");
    }

    const order = await prismaClient.order.findUnique({
        where: { order_id },
        select: { payment_url: true, order_id: true }
    });

    if (!order) {
        throw new ResponseError(404, "Order not found");
    }

    return order; // Mengembalikan data order yang berisi URL pembayaran
};


export default { createPaymentTransaction, handleMidtransNotification, getPaymentStatus, getPaymentUrl };