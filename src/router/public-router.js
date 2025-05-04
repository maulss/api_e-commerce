import express from "express";
import userController from "../controller/user-controller.js";
import paymentController from "../controller/payment_controller.js";

const publicRouter = express.Router();
publicRouter.post("/api/users/register", userController.register);
publicRouter.post("/api/users/login", userController.login);
// publicRouter.post("/api/payments/callback", paymentController.paymentCallback);

export { publicRouter };