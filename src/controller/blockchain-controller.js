import blockchainTransactionService from "../service/blockchain-service.js";
import { ResponseError } from "../error/response-error.js";

const getBlockchainTransaction = async (req, res, next) => {
    try {
        const { order_id } = req.params;

        if (!order_id) {
            throw new ResponseError(400, "Order ID is required");
        }

        const data = await blockchainTransactionService.getBlockchainTransaction(order_id);

        res.json({
            success: true,
            message: "Blockchain transaction retrieved successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export default { getBlockchainTransaction };
