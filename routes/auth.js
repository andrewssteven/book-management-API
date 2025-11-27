import { Router } from "express";
import { authController } from "../controller/auth.js";

const authRouter = Router()

//Endpoint: register new user
authRouter.post('/register', authController.register)
// Endpoint: user login
authRouter.post('/login', authController.login)
// Endpoint: user logout
authRouter.post('/logout', authController.logout)
// Endpoint: token refresh
authRouter.post('/token', authController.refresToken)

export default authRouter;