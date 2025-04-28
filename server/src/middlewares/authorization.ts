import { Request, Response, NextFunction } from 'express';
import { GetUser } from '../controllers/userController';
import { User } from '../models/userModel';
import { Types } from 'mongoose';
import { AppError } from './errorHandler';

declare module "express-serve-static-core" {
    interface Request {
        user: User;
    }
}

// Example Auth Handler
// Todo: Add proper oauth
export async function authHandler(req: Request, res: Response, next: NextFunction) {
    const authHeader: string | undefined = req.header('authorization');
    const token: string | undefined = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return
    }
    // verify jwt token and retrieve uid

    // For as2 token will be uid

    try {
        // validate userId
        if (!Types.ObjectId.isValid(token)) {
            throw new AppError("Invalid uid provided!", 404);
        }

        // retrieve user data
        const user: User | null = await GetUser(token);
        if (!user) {
            res.status(401).send({ message: "User not found!" })
            return
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
