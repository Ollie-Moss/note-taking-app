import { Router } from "express";
import { authParser } from "../middlewares/authParser";
import { LoginHandler, SignupHandler } from "../controllers/authController";

const AuthRouter: Router = Router()

AuthRouter.use(authParser);

AuthRouter.post('/login', LoginHandler)
AuthRouter.post('/signup', SignupHandler)

export { AuthRouter };
