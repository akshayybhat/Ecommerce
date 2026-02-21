import {Router} from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { cancelOrder, createOrder, getAllOrder, getOrderbyId } from "../controllers/order.js";

const orderRouter: Router = Router()

orderRouter.post("/", [authenticateUser], createOrder);
orderRouter.get("/", [authenticateUser], getAllOrder);
orderRouter.get("/:id", [authenticateUser], getOrderbyId);
orderRouter.put("/:id/cancel", [authenticateUser], cancelOrder);

export default orderRouter