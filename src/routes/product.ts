import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { authorizeAdmin } from "../middlewares/admin.js";
import { createProduct, deleteProduct, getProductByID, updateProduct } from "../controllers/product.js";

const productRouter: Router = Router();

productRouter.post('/', [authenticateUser, authorizeAdmin ], createProduct);
productRouter.put('/:id', [authenticateUser, authorizeAdmin ], updateProduct);
productRouter.delete('/:id', [authenticateUser, authorizeAdmin ], deleteProduct);
productRouter.get('/', [authenticateUser ], );
productRouter.get('/:id', [authenticateUser ], getProductByID);

export default productRouter