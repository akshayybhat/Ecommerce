import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { authorizeAdmin } from "../middlewares/admin.js";
import { createProduct } from "../controllers/product.js";

const productRouter: Router = Router();

productRouter.post('/', [authenticateUser, authorizeAdmin ], createProduct);

export default productRouter