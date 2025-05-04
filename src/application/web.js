import express from "express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../router/public-router.js";
import { apiRouter } from "../router/api-router.js";
import cors from "cors";

export const web = express();

web.use(cors());
web.use(express.json());
web.use("/uploads", express.static("uploads"));
web.use(publicRouter)
web.use(apiRouter)
web.use(errorMiddleware)
