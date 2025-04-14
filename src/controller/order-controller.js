import orderService from "../service/order-service";


const createOrder = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const order = await orderService.createOrder(user_id);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

export default {
    createOrder
}