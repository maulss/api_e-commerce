import cartService from '../service/cart-service.js';


const addItemToCart = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const { product_id, quantity } = req.body;

        const data = await cartService.addItemToCart({ user_id, product_id, quantity });
        res.status(201).json(data);
    } catch (error) {
        next(error);
    }
};

const getCart = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const data = await cartService.getCart(user_id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const cart_item_id = req.params.id;
        const { quantity } = req.body;

        const data = await cartService.updateCartItem(cart_item_id, { user_id, quantity });
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const deleteCartItem = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const cart_item_id = req.params.id;

        const data = await cartService.deleteCartItem(cart_item_id, user_id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const deleteCart = async (req, res, next) => {
    try {
        const user_id = req.user.user_id;
        const data = await cartService.deleteCart(user_id);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

export default {
    addItemToCart, getCart, updateCartItem, deleteCartItem, deleteCart
};