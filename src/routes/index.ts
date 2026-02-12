import { Router } from "express";
import authRoute from "./auth.js";
import productRouter from "./product.js";

const router:Router = Router()

router.use("/auth", authRoute);
router.use("/product", productRouter)

export default router