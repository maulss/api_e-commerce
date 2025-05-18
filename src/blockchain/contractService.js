import { paymentContract, getAccount } from './config.js';

class ContractService {
    static async storeTransaction(orderId, amount, status, currency, paymentMethod, paymentEmail, merchantName, customerName) {
        try {
            const fromAddress = await getAccount();
            console.log('From Address:', fromAddress);

            const receipt = await paymentContract.methods
                .storeTransaction(
                    orderId,
                    amount,
                    status,
                    currency,
                    paymentMethod,
                    paymentEmail,
                    merchantName,
                    customerName
                )
                .send({
                    from: fromAddress,
                    gas: 500000
                });


            return {
                success: true,
                transactionHash: receipt.transactionHash
            };
        } catch (error) {
            console.error('Blockchain Error:', error);
            throw new Error('Failed to store transaction on blockchain');
        }
    }

    static async getTransaction(orderId) {
        try {
            const result = await paymentContract.methods.getTransaction(orderId).call();

            return {
                orderId: result[0],
                amount: result[1],
                status: result[2],
                currency: result[3],
                paymentMethod: result[4],
                paymentEmail: result[5],
                merchantName: result[6],
                customerName: result[7],
                timestamp: result[8]
            };
        } catch (error) {
            console.error('Blockchain Error:', error);
            throw new Error('Failed to fetch transaction from blockchain');
        }
    }

    static async getAllOrderIds() {
        return paymentContract.methods.getAllOrderIds().call();
    }

    static async getTransactionCount() {
        return paymentContract.methods.getTransactionCount().call();
    }

    static async getAllTransactions() {
        return paymentContract.methods.getAllTransactions().call();
    }
}

export default ContractService;
