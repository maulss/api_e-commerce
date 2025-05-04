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
        const status = req.query.status;
        const orders = await orderService.getUserOrders(user_id, status);

        res.json(orders);
    } catch (error) {
        next(error);
    }
}

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

const updateOrderStatus = async (req, res, next) => {
    try {
        const order_id = req.params.id;
        const { status } = req.body;
        const updated = await orderService.updateOrderStatus(order_id, status);
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const order_id = req.params.id;
        const result = await orderService.cancelOrder(order_id, user_id);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export default {
    createOrder, getUserOrders, getOrderDetail, updateOrderStatus, cancelOrder
}