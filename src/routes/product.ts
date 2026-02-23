import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.js";
import { authorizeAdmin } from "../middlewares/admin.js";
import { createProduct, deleteProduct, fetchAllProducts, fullTextSearchProducts, getProductByID, updateProduct } from "../controllers/product.js";

const productRouter: Router = Router();

productRouter.post('/', [authenticateUser, authorizeAdmin ], createProduct);
productRouter.put('/:id', [authenticateUser, authorizeAdmin ], updateProduct);
productRouter.delete('/:id', [authenticateUser, authorizeAdmin ], deleteProduct);
productRouter.get('/', [authenticateUser ], fetchAllProducts );

productRouter.get('/search', [authenticateUser ], fullTextSearchProducts);
productRouter.get('/:id', [authenticateUser ], getProductByID);

export default productRouter