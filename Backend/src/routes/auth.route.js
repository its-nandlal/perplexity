import { getMe, login, register, verifyEmail } from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { Router } from "express"

const authRouter = Router()


authRouter.post("/register", registerValidator, register)
authRouter.post("/login", loginValidator, login)
authRouter.get("/verify-email", verifyEmail)


authRouter.get('/get-me', authUser, getMe)

export default authRouter;