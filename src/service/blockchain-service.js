import { ResponseError } from "../error/response-error.js";
import ContractService from "../blockchain/contractService.js";

const getBlockchainTransaction = async (order_id) => {
    if (!order_id) {
        throw new ResponseError(400, "Order ID is required");
    }

    try {
        const transactionData = await ContractService.getTransaction(order_id);

        if (!transactionData) {
            throw new ResponseError(404, "Transaction not found on blockchain");
        }

        const formattedData = {
            orderId: transactionData.orderId?.toString(),
            amount: transactionData.amount?.toString(),
            status: transactionData.status,
            currency: transactionData.currency,
            paymentMethod: transactionData.paymentMethod,
            paymentEmail: transactionData.paymentEmail,
            merchantName: transactionData.merchantName,
            customerName: transactionData.customerName,
            timestamp: transactionData.timestamp ? new Date(Number(transactionData.timestamp) * 1000).toISOString() : null,
        };

        return formattedData;
    } catch (error) {
        throw new ResponseError(500, `Failed to fetch transaction from blockchain: ${error.message}`);
    }
};

export default {
    getBlockchainTransaction,
};
