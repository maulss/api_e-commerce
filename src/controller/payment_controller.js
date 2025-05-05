import paymentService from "../service/payment_service.js";

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


export default { createPayment, handleNotification, checkPaymentStatus };
