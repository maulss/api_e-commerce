import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import { upload } from "../middleware/upload_middleware.js";

const apiRouter = express.Router();
apiRouter.use(authMiddleware)
apiRouter.get("/api/users/current", userController.getUser);
apiRouter.patch("/api/users/update", upload.single("profile_picture"), userController.updateUser);
apiRouter.patch("/api/users/change-password", userController.changePassword);

export { apiRouter };