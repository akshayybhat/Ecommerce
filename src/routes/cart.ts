import {Router} from 'express'
import { createCartItem, deleteCartItem, fetchAllCartItem } from '../controllers/cart.js'
import { authenticateUser } from '../middlewares/auth.js'

const cartRouter: Router = Router()


cartRouter.post("/", [authenticateUser], createCartItem);
cartRouter.delete("/:id", [authenticateUser], deleteCartItem)
cartRouter.get("/", [authenticateUser], fetchAllCartItem )

export default cartRouter