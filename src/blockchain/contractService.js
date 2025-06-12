// import { paymentContract, getAccount } from './config.js';

// class ContractService {
//     static async storeTransaction(orderId, amount, status, currency, paymentMethod, paymentEmail, merchantName, customerName) {
//         try {
//             // const fromAddress = await getAccount();
//             // console.log('From Address:', fromAddress);

//             const receipt = await paymentContract.methods
//                 .storeTransaction(
//                     orderId,
//                     amount,
//                     status,
//                     currency,
//                     paymentMethod,
//                     paymentEmail,
//                     merchantName,
//                     customerName
//                 )
//                 .send({
//                     from: fromAddress,
//                     gas: 500000
//                 });


//             return {
//                 success: true,
//                 transactionHash: receipt.transactionHash
//             };
//         } catch (error) {
//             console.error('Blockchain Error:', error);
//             throw new Error('Failed to store transaction on blockchain');
//         }
//     }

//     static async getTransaction(orderId) {
//         try {
//             const result = await paymentContract.methods.getTransaction(orderId).call();

//             return {
//                 orderId: result[0],
//                 amount: result[1],
//                 status: result[2],
//                 currency: result[3],
//                 paymentMethod: result[4],
//                 paymentEmail: result[5],
//                 merchantName: result[6],
//                 customerName: result[7],
//                 timestamp: result[8]
//             };
//         } catch (error) {
//             console.error('Blockchain Error:', error);
//             throw new Error('Failed to fetch transaction from blockchain');
//         }
//     }

//     static async getAllOrderIds() {
//         return paymentContract.methods.getAllOrderIds().call();
//     }

//     static async getTransactionCount() {
//         return paymentContract.methods.getTransactionCount().call();
//     }

//     static async getAllTransactions() {
//         return paymentContract.methods.getAllTransactions().call();
//     }
// }

// export default ContractService;





// MENGGUNAKAN SEPOLIA TESNET






import { paymentContract, getAccount, web3 } from './config.js';

const nonceCache = new Map();

class ContractService {

    static async getCurrentNonce(address) {
        if (nonceCache.has(address)) {
            const cachedNonce = nonceCache.get(address);
            // Gunakan BigInt untuk operasi nonce
            nonceCache.set(address, BigInt(cachedNonce) + 1n);
            return cachedNonce;
        }
        const currentNonce = await web3.eth.getTransactionCount(address, 'pending');
        // Simpan sebagai BigInt
        nonceCache.set(address, BigInt(currentNonce) + 1n);
        return currentNonce;
    }

    static async storeTransaction(orderId, amount, status, currency, paymentMethod, paymentEmail, merchantName, customerName) {
        try {
            const fromAddress = getAccount();
            console.log('Storing transaction with amount:', amount);
            const startTime = Date.now();

            // Dapatkan nonce yang benar
            const nonce = await this.getCurrentNonce(fromAddress);

            // Hitung gas price dengan konversi yang tepat
            const suggestedGasPrice = await web3.eth.getGasPrice();
            const suggestedGasPriceBigInt = typeof suggestedGasPrice === 'bigint'
                ? suggestedGasPrice
                : BigInt(suggestedGasPrice);

            const gasPrice = (suggestedGasPriceBigInt * 150n) / 100n;

            const amountString = Math.floor(amount).toString();
            const receipt = await paymentContract.methods
                .storeTransaction(
                    orderId,
                    amountString,
                    status,
                    currency,
                    paymentMethod,
                    paymentEmail,
                    merchantName,
                    customerName
                )
                .send({
                    from: fromAddress,
                    gas: 500000,
                    nonce: nonce,
                    gasPrice: gasPrice.toString()
                });
            const endTime = Date.now();
            const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);
            console.log(`Transaction successful with amount: ${amountString}. Time taken: ${durationSeconds} seconds`);
            return {
                success: true,
                transactionHash: receipt.transactionHash,
                amountStored: amountString
            };
        } catch (error) {
            console.error('Blockchain Error Details:', {
                error: error.message,
                amountAttempted: amount,
                inputParams: arguments
            });
            throw new Error(`Failed to store transaction: ${error.message}`);
        }
    }

    static async getTransaction(orderId) {
        try {
            const result = await paymentContract.methods.getTransaction(orderId).call();

            // Sesuaikan dengan struktur return dari kontrak baru
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
        try {
            return await paymentContract.methods.getAllOrderIds().call();
        } catch (error) {
            console.error('Blockchain Error:', error);
            throw new Error('Failed to get all order IDs from blockchain');
        }
    }

    static async getTransactionCount() {
        try {
            return await paymentContract.methods.getTransactionCount().call();
        } catch (error) {
            console.error('Blockchain Error:', error);
            throw new Error('Failed to get transaction count from blockchain');
        }
    }

    static async getAllTransactions() {
        try {
            const transactions = await paymentContract.methods.getAllTransactions().call();

            // Format hasil sesuai dengan struktur kontrak baru
            return transactions.map(tx => ({
                orderId: tx.order_id,
                amount: tx.amount,
                status: tx.status,
                currency: tx.currency,
                paymentMethod: tx.payment_method,
                paymentEmail: tx.payment_email,
                merchantName: tx.merchant_name,
                customerName: tx.customer_name,
                timestamp: tx.timestamp
            }));
        } catch (error) {
            console.error('Blockchain Error:', error);
            throw new Error('Failed to get all transactions from blockchain');
        }
    }

    static async isOrderIdExists(orderId) {
        try {
            return await paymentContract.methods.isOrderIdExists(orderId).call();
        } catch (error) {
            console.error('Blockchain Error:', error);
            throw new Error('Failed to check order ID existence on blockchain');
        }
    }
}

export default ContractService;
