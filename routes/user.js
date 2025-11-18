import { Router } from "express";
import { userController } from "../controller/user.js";

const userrouter = Router()

// endpoint: signUp, create new user
userrouter.post('/', userController.register)
userrouter.post('/login', userController.Login)
userrouter.post('/token', userController.refresToken)
userrouter.get('/', userController.getUsers)




export default userrouter