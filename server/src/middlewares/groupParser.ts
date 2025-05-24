import { Request, Response, NextFunction } from "express";
import { Group, GroupModel } from "../models/groupModel";

declare module "express-serve-static-core" {
    interface Request {
        group?: Group;
    }
}

export async function groupParser(req: Request, res: Response, next: NextFunction) {
    req.group = req.body?.group;
    next()
}
