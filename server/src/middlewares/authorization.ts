import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';
import { Types } from 'mongoose';
import { AppError } from './errorHandler';
import { groupService, noteService, userService } from '../services/services';

// Add user to Request type to be used by route handlers
declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}

// Auth Handler
// Todo: Add proper auth
export async function authHandler(req: Request, res: Response, next: NextFunction) {
    const authHeader: string | undefined = req.header('authorization');
    const token: string | undefined = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return
    }
    // Todo: verify jwt token and retrieve uid


    // for as2 token will be uid

    try {
        const user = await userService.validateToken(token);
        // validate userId
        if (!Types.ObjectId.isValid(token)) {
            throw new AppError("Invalid uid provided!", 404);
        }

        // if no user is found return 401 forbidden
        if (!user) {
            res.status(401).send({ message: "User not found!" })
            return
        }

        // set user object on request
        req.user = user;

        // set user id in services
        groupService.setUser(user._id.toString())
        noteService.setUser(user._id.toString())

        // call next route handler
        next();
    } catch (error) {
        next(error);
    }
};
