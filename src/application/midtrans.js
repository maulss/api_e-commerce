import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

dotenv.config();

const midtrans = new midtransClient.Snap({
    isProduction: false, // Set true jika sudah siap untuk produksi
    serverKey: process.env.SERVER_KEY,
    clientKey: process.env.CLIENT_KEY,
});

export default midtrans;
