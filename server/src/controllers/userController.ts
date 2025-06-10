import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";

// Gets a user's data
export async function GetUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
        // Validate user has been retrieved 
        //  -- Request won't make it here if user is not found but here anyway just in case
        if (!req.user) throw new AppError("No user found", 401)

        // Return user data
        res.status(200).send({ message: "Authenticated!", user: req.user });
    } catch (error) {
        next(error)
    }
}
