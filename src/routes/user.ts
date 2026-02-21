import {Router} from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { addAddress, deleteAddress, fetchAllAddress, updateUser } from "../controllers/user.js"

const userRouter: Router = Router()

// create an address
userRouter.post("/address", [authenticateUser], addAddress);
userRouter.delete("/address/:id", [authenticateUser], deleteAddress );
userRouter.get("/address", [authenticateUser], fetchAllAddress);
userRouter.put("/address", [authenticateUser], updateUser);


export default userRouter