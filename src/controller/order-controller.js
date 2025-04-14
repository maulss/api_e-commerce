import orderService from "../service/order-service.js";


const createOrder = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const order = await orderService.createOrder(user_id);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const getUserOrders = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const orders = await orderService.getUserOrders(user_id);
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

const getOrderDetail = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const order_id = req.params.id;
        const order = await orderService.getOrderDetail(order_id, user_id);
        res.json(order);
    } catch (error) {
        next(error);
    }
};

export default {
    createOrder, getUserOrders, getOrderDetail
}