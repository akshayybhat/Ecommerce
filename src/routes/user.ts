import {Router} from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { addAddress, deleteAddress, fetchAllAddress } from "../controllers/user.js"

const userRouter: Router = Router()

// create an address
userRouter.post("/", [authenticateUser], addAddress);
userRouter.delete("/:id", [authenticateUser], deleteAddress );
userRouter.get("/", [authenticateUser], fetchAllAddress);


export default userRouter