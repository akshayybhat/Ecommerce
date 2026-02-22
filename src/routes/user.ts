import {Router} from "express"
import { authenticateUser } from "../middlewares/auth.js"
import { addAddress, changeUserRole, deleteAddress, fetchAllAddress, fetchAllUsers, fetchUserById, updateUser } from "../controllers/user.js"
import { authorizeAdmin } from "../middlewares/admin.js";

const userRouter: Router = Router()

// create an address
userRouter.post("/address", [authenticateUser], addAddress);
userRouter.delete("/address/:id", [authenticateUser], deleteAddress );
userRouter.get("/address", [authenticateUser], fetchAllAddress);
userRouter.put("/address", [authenticateUser], updateUser);

userRouter.get("/", [authenticateUser, authorizeAdmin], fetchAllUsers);
userRouter.get("/:id", [authenticateUser, authorizeAdmin], fetchUserById);
userRouter.put("/:id/role", [authenticateUser, authorizeAdmin], changeUserRole);


export default userRouter