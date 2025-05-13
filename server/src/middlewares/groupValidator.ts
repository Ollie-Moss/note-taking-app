import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";
import { Group, GroupModel } from "../models/groupModel";
import { Types } from "mongoose";
import { groupService } from "../services/services";

declare module "express-serve-static-core" {
    interface Request {
        group: Group;
    }
}

export async function groupValidator(req: Request, res: Response, next: NextFunction) {
    // Requires group
    groupService.setUser(req.user._id.toString())
    if (req.method == "POST" || req.method == "PATCH") {
        if (!req.body?.group) return next(new AppError("Group is required!", 400));

        if (!Types.ObjectId.isValid(req.body.group._id)) req.body.group._id = new Types.ObjectId()
        const updates = { ...req.body.group, uid: req.user._id };

        const group = await GroupModel.findById(updates._id);
        group?.set(updates)
        group?.validate(Object.keys(updates)).catch((err: Error) => {
            return next(new AppError(err.message, 400))
        })
        // discards changes
        const freshGroup = await GroupModel.findById(updates._id);


        req.group = req.body.group;
    }
    next()
}
