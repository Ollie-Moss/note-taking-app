import { Router } from "express";
import { GetUserHandler } from "../controllers/userController";
import { authHandler } from "../middlewares/authorization";

const UserRouter: Router = Router()

UserRouter.use(authHandler);

UserRouter.get('/', GetUserHandler)

export { UserRouter };
