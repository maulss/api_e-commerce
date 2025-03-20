import express from "express";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../router/public-router.js";
import { apiRouter } from "../router/api-router.js";

export const web = express();

web.use(express.json());
web.use(publicRouter)
web.use(apiRouter)
web.use(errorMiddleware)