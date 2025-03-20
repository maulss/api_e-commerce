import userService from '../service/user-service.js'

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    try {
        const result = await userService.getUser({
            user_id: req.user.user_id
        })
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    try {
        const result = await userService.updateUser(req.body, req.user.user_id);
        res.status(200).json({
            data: result
        });
    } catch (error) {
        next(error);
    }
}

export default {
    register, login, getUser, updateUser
}