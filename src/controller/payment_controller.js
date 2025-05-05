import paymentService from "../service/payment_service.js";
import { ResponseError } from "../error/response-error.js";

const createPayment = async (req, res, next) => {
    try {

        const { order_id } = req.params;

        if (!order_id) {
            throw new ResponseError(400, "Order ID is required");
        }

        const paymentResponse = await paymentService.createPaymentTransaction(order_id);

        res.json({
            success: true,
            message: "Payment initiated successfully",
            data: {
                paymentDetails: paymentResponse.paymentDetails,
                orderId: paymentResponse.orderId
            }
        });
    } catch (error) {
        next(error);
    }
};


const handleNotification = async (req, res, next) => {
    try {

        const notification = req.body;


        const result = await paymentService.handleMidtransNotification(notification);

        res.json({
            success: true,
            message: result.message,
            data: {
                order_id: result.order_id,
                status: result.status
            }
        });
    } catch (error) {
        next(error);
    }
};

const checkPaymentStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            throw new ResponseError(400, "Order ID is required");
        }

        const statusResponse = await paymentService.getPaymentStatus(orderId);

        res.json({
            success: true,
            message: `Payment status for order ${orderId}`,
            data: {
                status: statusResponse.status,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getPaymentUrl = async (req, res, next) => {
    try {
        const { order_id } = req.params;

        // Memanggil service untuk mendapatkan URL pembayaran
        const order = await paymentService.getPaymentUrl(order_id);

        res.json({
            success: true,
            message: "Payment URL retrieved successfully",
            data: {
                order_id: order.order_id,
                payment_url: order.payment_url
            }
        });
    } catch (error) {
        next(error);
    }
};


export default { createPayment, handleNotification, checkPaymentStatus, getPaymentUrl };