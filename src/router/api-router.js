import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import productController from "../controller/product_controller.js";
import { uploadWithPrefix } from "../middleware/upload_middleware.js";
import { isAdmin } from "../middleware/admin-middleware.js";
import categoryController from "../controller/category-controller.js";
import bannerController from "../controller/banner_controller.js";
import cartController from "../controller/cart-controller.js";
// import orderController from "../controller/order2-controller.js";
import paymentController from "../controller/payment_controller.js";
import orderController from "../controller/order-controller.js";


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
// apiRouter.post("/api/products/create", isAdmin, productController.create
apiRouter.post(
    "/api/products/create",
    isAdmin,
    uploadWithPrefix("product").single("image_url"),
    productController.createProduct
);

apiRouter.get("/api/products", productController.getListProduct);
apiRouter.get("/api/products/:productId", productController.getProductById);
apiRouter.put(
    "/api/products/:productId",
    isAdmin,
    uploadWithPrefix("product").single("image_url"),
    productController.updateProduct
);
apiRouter.delete("/api/products/:productId", isAdmin, productController.deleteProduct);

//categories
apiRouter.post("/api/categories/create", isAdmin, uploadWithPrefix("category").single("image_url"), categoryController.createCategory,);
apiRouter.get("/api/categories", categoryController.getListCategory);
apiRouter.put("/api/categories/:categoryId", isAdmin, uploadWithPrefix("category").single("image_url"), categoryController.updateCategory);
apiRouter.delete("/api/categories/:categoryId", isAdmin, categoryController.deleteCategory);

//banners
apiRouter.post(
    "/api/banners/create",
    isAdmin,
    uploadWithPrefix("banner").single("image_url"),
    bannerController.createBanner
);
apiRouter.get("/api/banners", bannerController.getAllBanners);
apiRouter.put(
    "/api/banners/:id",
    isAdmin,
    uploadWithPrefix("banner").single("image_url"),
    bannerController.updateBanner
);
apiRouter.delete("/api/banners/:id", isAdmin, bannerController.deleteBanner);

//carts
apiRouter.post("/api/carts/add", cartController.addItemToCart);
apiRouter.get("/api/carts", cartController.getCart);
apiRouter.put("/api/carts/items/:id", cartController.updateCartItem);
apiRouter.delete("/api/carts/items/:id", cartController.deleteCartItem);
apiRouter.delete("/api/carts/clear", cartController.deleteCart);

//orders
apiRouter.post("/api/orders/create", orderController.createOrder);
apiRouter.get("/api/orders", orderController.getUserOrders);
apiRouter.get("/api/orders/:orderId", orderController.getOrderDetail);
apiRouter.put("/api/orders/:id/status", isAdmin, orderController.updateOrderStatus);
apiRouter.patch("/api/orders/:id/cancel", orderController.cancelOrder);

//payments
apiRouter.post("/api/payments/:order_id", paymentController.createPayment);
apiRouter.get("/api/payments/status/:orderId", paymentController.checkPaymentStatus);
apiRouter.get("/api/payments/url/:order_id", paymentController.getPaymentUrl);





export { apiRouter };