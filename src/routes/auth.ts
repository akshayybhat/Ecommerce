import {Router} from "express"
import { login, signup } from "../controllers/auth.js"

const authRoute: Router = Router()


authRoute.post("/signup", signup);
authRoute.post("/login", login);

export default authRoute