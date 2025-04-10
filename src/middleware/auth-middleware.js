import jwt from "jsonwebtoken";
import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prismaClient.user.findUnique({
            where: { user_id: decoded.user_id },
        });


        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};