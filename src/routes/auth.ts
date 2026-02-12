import {Router} from "express"
import { login, signup, me } from "../controllers/auth.js"
import { authenticateUser } from "../middlewares/auth.js";

const authRoute: Router = Router()


authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.get("/me", [authenticateUser], me);

export default authRoute