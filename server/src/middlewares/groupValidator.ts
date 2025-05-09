import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { Group, GroupModel } from "../models/groupModel";
import { Types } from "mongoose";

declare module "express-serve-static-core" {
    interface Request {
        group: Group;
    }
}

export async function groupValidator(req: Request, res: Response, next: NextFunction) {
    // Requires group
    if (req.method == "POST" || req.method == "PUT") {
        if (!req.body?.group) return next(new AppError("Group is required!", 400));

        if (!Types.ObjectId.isValid(req.body.group._id)) req.body.group._id = new Types.ObjectId()
        const group = new GroupModel({ ...req.body.group, uid: req.user._id });

        await group.validate().catch((err: Error) => {
            return next(new AppError(err.message, 400))
        })

        req.group = req.body.group;
    }
    next()
}
