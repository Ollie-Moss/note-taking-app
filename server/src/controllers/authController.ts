import { AppError } from "../middlewares/errorHandler";
import { Request, Response, NextFunction } from "express"
import { userService } from "../services/services"
import { IUser } from "../models/userModel";

// Creates a JWT
export async function LoginHandler(req: Request, res: Response, next: NextFunction) {
    try {

        console.log(`POST 'api/auth/login'`)
        // Validate and log body data
        if (!req.email) throw new AppError("Email is required!", 400);
        if (!req.password) throw new AppError("Pasword is required!", 400);

        console.log("login: ", { email: req.email, password: req.password })
        // Attempt login
        const result = await userService.loginWithEmailAndPassword(req.email, req.password)

        // Return token and user data on success
        res.status(200).json({
            message: "Logged in!",
            token: result.jwt,
            user: result.user
        });
    } catch (error) {
        next(error)
    }
}

// Creates user and JWT
export async function SignupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`POST 'api/auth/signup'`)
        // Validate and log body data
        if (!req.email) throw new AppError("Email is required!", 400);
        if (!req.password) throw new AppError("Pasword is required!", 400);
        if (!req.name) throw new AppError("Name is required!", 400);

        // Log user data
        const user: IUser = { name: req.name, email: req.email, password_hash: req.password };
        console.log("User: ", user)

        // Attempt signup
        const result = await userService.signup(user)

        // Return token and user data on success
        res.status(200).json({
            message: "Signed up!",
            token: result.jwt,
            user: result.user
        });
    } catch (error) {
        next(error)
    }
}
