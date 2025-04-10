import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import productController from "../controller/product_controller.js";
import { uploadWithPrefix } from "../middleware/upload_middleware.js";
import { isAdmin } from "../middleware/admin-middleware.js";

const apiRouter = express.Router();
apiRouter.use(authMiddleware)

//users
apiRouter.get("/api/users/current", userController.getUser);
// apiRouter.patch("/api/users/update", upload.single("profile_picture"), userController.updateUser);
apiRouter.patch(
    "/api/users/update",
    uploadWithPrefix("profile").single("profile_picture"),
    userController.updateUser
);
apiRouter.patch("/api/users/change-password", userController.changePassword);

//products
// apiRouter.post("/api/products/create", isAdmin, productController.createProduct);
apiRouter.post(
    "/api/products/create",
    isAdmin,
    uploadWithPrefix("product").single("image_url"),
    productController.createProduct
);

export { apiRouter };