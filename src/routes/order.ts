import {Router} from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { createOrder, getAllOrder, getOrderbyId } from "../controllers/order.js";

const orderRouter: Router = Router()

orderRouter.post("/", [authenticateUser], createOrder);
orderRouter.get("/", [authenticateUser], getAllOrder);
orderRouter.get("/:id", [authenticateUser], getOrderbyId);

export default orderRouter