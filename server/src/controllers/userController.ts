import { NextFunction, Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler";

export async function GetUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.user) throw new AppError("No user found", 401)
        res.status(200).send({ message: "Authenticated!", user: req.user });
    } catch (error) {
        next(error)
    }
}
