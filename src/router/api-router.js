import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

const apiRouter = express.Router();
apiRouter.use(authMiddleware)
apiRouter.get("/api/users/current", userController.getUser);
apiRouter.patch("/api/users/current", userController.updateUser);

export { apiRouter };