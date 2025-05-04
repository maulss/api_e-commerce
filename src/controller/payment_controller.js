import paymentService from "../service/payment_service.js";

const createPayment = async (req, res, next) => {
    try {
        // Mengambil order_id dari parameter URL
        const { order_id } = req.params;

        // Validasi order_id
        if (!order_id) {
            throw new ResponseError(400, "Order ID is required");
        }

        // Menggunakan service untuk membuat transaksi dan mendapatkan token dari Midtrans Snap
        const paymentResponse = await paymentService.createPaymentTransaction(order_id);

        res.json({
            success: true,
            message: "Payment initiated successfully",
            data: paymentResponse  // Mengirimkan token Snap ke frontend
        });
    } catch (error) {
        next(error);
    }
};

export default { createPayment };
