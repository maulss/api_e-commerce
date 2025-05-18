import Web3 from 'web3';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


function validateConfig() {
    const requiredVars = [
        'ETHEREUM_NODE_URL',
        'CONTRACT_ADDRESS',
        'WALLET_PRIVATE_KEY'
    ];

    for (const varName of requiredVars) {
        if (!process.env[varName]) {
            throw new Error(`Missing environment variable: ${varName}`);
        }
    }

    if (!process.env.WALLET_PRIVATE_KEY.startsWith('0x') ||
        process.env.WALLET_PRIVATE_KEY.length !== 66) {
        throw new Error('Invalid private key format');
    }
}


const loadABI = async () => {
    const abiPath = path.join(__dirname, 'abi', 'PaymentTransactionStorage.json');
    try {
        return JSON.parse(await readFile(abiPath, 'utf-8'));
    } catch (err) {
        throw new Error(`Failed to load ABI: ${err.message}`);
    }
};


const initializeWeb3 = () => {
    try {
        validateConfig();

        const web3 = new Web3(process.env.ETHEREUM_NODE_URL);
        const account = web3.eth.accounts.privateKeyToAccount(
            process.env.WALLET_PRIVATE_KEY
        );

        web3.eth.accounts.wallet.add(account);
        console.log(`Connected to ${process.env.ETHEREUM_NODE_URL}`);
        console.log(`Using account: ${account.address}`);

        return { web3, account };
    } catch (err) {
        console.error('Web3 Initialization Error:', err.message);
        throw err;
    }
};


const PaymentTransactionStorage = await loadABI();
const { web3, account } = initializeWeb3();

export const paymentContract = new web3.eth.Contract(
    PaymentTransactionStorage.abi,
    process.env.CONTRACT_ADDRESS
);

export const getAccount = () => account.address;