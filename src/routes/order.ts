import {Router} from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { cancelOrder, changeOrderStatus, createOrder, fetchAllOrders, getAllOrder, getOrderbyId, getOrderUser } from "../controllers/order.js";
import { authorizeAdmin } from "../middlewares/admin.js";

const orderRouter: Router = Router()

orderRouter.post("/", [authenticateUser], createOrder);
orderRouter.get("/", [authenticateUser], getAllOrder);

orderRouter.put("/:id/cancel", [authenticateUser], cancelOrder);

orderRouter.get("/index", [authenticateUser, authorizeAdmin], fetchAllOrders);
orderRouter.get("/:id", [authenticateUser], getOrderbyId);
orderRouter.put("/:id", [authenticateUser, authorizeAdmin], changeOrderStatus);
orderRouter.get("/user/:id", [authenticateUser, authorizeAdmin], getOrderUser);

export default orderRouter