import { Router } from "express";
import { GetUserHandler } from "../controllers/userController";
import { authHandler } from "../middlewares/authorization";

const UserRouter: Router = Router()

// Apply user authentication to all user routes
UserRouter.use(authHandler);

// GET a user
UserRouter.get('/', GetUserHandler)

export { UserRouter };
