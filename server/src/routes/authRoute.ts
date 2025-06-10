import { Router } from "express";
import { authParser } from "../middlewares/authParser";
import { LoginHandler, SignupHandler } from "../controllers/authController";

const AuthRouter: Router = Router()

AuthRouter.use(authParser);

// Login a user
AuthRouter.post('/login', LoginHandler)
// Signup and create a user
AuthRouter.post('/signup', SignupHandler)

export { AuthRouter };
