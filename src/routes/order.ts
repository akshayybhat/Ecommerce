import {Router} from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { createOrder } from "../controllers/order.js";

const orderRouter: Router = Router()

orderRouter.post("/", [authenticateUser], createOrder)

export default orderRouter