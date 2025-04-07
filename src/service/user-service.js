import { prismaClient } from "../application/database.js";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error.js";


const register = async (body) => {

    const user = validate(registerUserValidation, body);

    const existingUser = await prismaClient.user.findUnique({
        where: { email: user.email }
    });

    if (existingUser) {
        throw new ResponseError(400, "Email already exists");
    }

    const existingUserByPhone = await prismaClient.user.findUnique({
        where: { phone_number: user.phone_number }
    });

    if (existingUserByPhone) {
        throw new ResponseError(400, "Phone number already exists");
    }

    user.user_id = uuid();


    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            user_id: true,
            name: true,
            email: true,
            phone_number: true,
            address: true,
            role: true,
            profile_picture: true
        }
    });
};

const login = async (request) => {
    const user = validate(loginUserValidation, request);

    const checkUser = await prismaClient.user.findUnique({
        where: { email: user.email }
    });

    if (!checkUser) {
        throw new ResponseError(404, "Invalid email or password");
    }

    const isPasswordMatch = await bcrypt.compare(user.password, checkUser.password);

    if (!isPasswordMatch) {
        throw new ResponseError(404, "Invalid email or password");
    }

    const token = jwt.sign({ user_id: checkUser.user_id, email: checkUser.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return {
        success: true,
        message: "Login success",
        token: token
    }
}

const getUser = async (request) => {
    const user = validate(getUserValidation, request);

    const checkUser = await prismaClient.user.findUnique({
        where: {
            user_id: user.user_id
        },
        select: {
            user_id: true,
            name: true,
            email: true,
            phone_number: true,
            address: true,
            profile_picture: true,
            role: true
        }
    });

    if (!checkUser) {
        throw new ResponseError(404, "User not found");
    }

    return {
        success: true,
        message: "User found",
        data: checkUser
    };
}

const updateUser = async (request, userIdFromToken) => {
    const user = validate(updateUserValidation, request);

    const checkUser = await prismaClient.user.findUnique({
        where: { user_id: userIdFromToken }
    });

    if (!checkUser) {
        throw new ResponseError(404, "User not found");
    }


    if ((user.email && user.email !== checkUser.email) ||
        (user.phone_number && user.phone_number !== checkUser.phone_number)) {

        const existingUser = await prismaClient.user.findFirst({
            where: {
                OR: [
                    { email: user.email || undefined },
                    { phone_number: user.phone_number || undefined }
                ],
                NOT: {
                    user_id: userIdFromToken
                }
            }
        });

        if (existingUser) {
            throw new ResponseError(400, "Email or phone number is already in use");
        }
    }

    const updatedData = Object.assign({}, checkUser, user, { user_id: userIdFromToken });


    // return prismaClient.user.update({
    //     where: { user_id: userIdFromToken },
    //     data: updatedData,
    //     select: {
    //         user_id: true,
    //         name: true,
    //         email: true,
    //         phone_number: true,
    //         address: true,
    //     }
    // });

    const updatedUser = await prismaClient.user.update({
        where: { user_id: userIdFromToken },
        data: updatedData,
        select: {
            user_id: true,
            name: true,
            email: true,
            phone_number: true,
            address: true,
            profile_picture: true,
            role: true
        }
    });

    return {
        success: true,
        message: "User updated successfully",
        data: updatedUser
    };
};


export default { register, login, getUser, updateUser };
