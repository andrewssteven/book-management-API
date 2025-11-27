import { Router } from "express";
import { userController } from "../controller/user.js";
import { authorizedRole } from "../middleware/roleAuth.js";
import { authenticate } from "../middleware/Auth.js";

const userRouter = Router()

// Endpoint: retrieve all available users
userRouter.get('/', authenticate, authorizedRole("admin"), userController.getUsers)
// Endpoint: retrieve user by Id
userRouter.get('/:id', authenticate, authorizedRole("user", "admin"), userController.getUserId)
// Endpoint: update user information
userRouter.put('/:id', authenticate, authorizedRole("user", "admin"), userController.updateUser)
// Endpoint: delete user information
userRouter.delete('/:id', authenticate, authorizedRole("user", "admin"), userController.deleteUser)


export default userRouter