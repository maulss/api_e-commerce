import userService from '../service/user-service.js'


const register = async (req, res, next) => {
    try {
        const newUser = await userService.register(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

const getUser = async (req, res, next) => {
    try {
        const result = await userService.getUser({
            user_id: req.user.user_id
        })
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}



const updateUser = async (req, res, next) => {
    try {
        const body = req.body;

        if (req.file) {
            body.profile_picture = `/uploads/${req.file.filename}`;
        }

        const result = await userService.updateUser(body, req.user.user_id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const result = await userService.changePassword(req.body, req.user.user_id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export default {
    register, login, getUser, updateUser, changePassword
}