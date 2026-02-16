import { Router } from "express";
import authRoute from "./auth.js";
import productRouter from "./product.js";
import userRouter from "./user.js";

const router:Router = Router()

router.use("/auth", authRoute);
router.use("/product", productRouter);
router.use("/user", userRouter);

export default router