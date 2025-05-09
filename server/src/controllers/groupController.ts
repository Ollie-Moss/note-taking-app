import { Request, Response, NextFunction } from "express";
import { Group, IGroup } from "../models/groupModel";
import { Types } from "mongoose";
import { AppError } from "../middlewares/errorHandler";
import { AppendGroup, DeleteGroup, GetGroup, GetUsersGroups, InsertGroupBetweenGroups, MoveGroupBetween, MoveGroupToLast, UpdateGroup } from "./groupDataAccess";

// ----- API Route Handlers ------

export async function MoveGroupHandler(req: Request, res: Response, next: NextFunction) {
    if (req.body.beforeId && req.body.afterId) {
        const afterId: Types.ObjectId = new Types.ObjectId(req.body.afterId as string)
        const beforeId: Types.ObjectId = new Types.ObjectId(req.body.beforeId as string)

        const group: Group | null =
            await MoveGroupBetween(req.group.uid, req.group._id, beforeId, afterId);

        res.status(200).send({ message: "Group moved!", group: group });
        return
    }

    const group: Group | null = await MoveGroupToLast(req.group.uid, req.group._id);
    res.status(200).send({ message: "Group moved!", group: group });
}

export async function CreateGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.body.beforeId && req.body.afterId) {
            const afterId: Types.ObjectId = new Types.ObjectId(req.body.afterId as string)
            const beforeId: Types.ObjectId = new Types.ObjectId(req.body.beforeId as string)

            const group: Group | null =
                await InsertGroupBetweenGroups(req.group, beforeId, afterId);

            res.status(200).send({ message: "Group created!", group: group });
        }

        const group: Group | null = await AppendGroup(req.group);

        res.status(200).send({ message: "Group created!", group: group });
    } catch (error) {
        next(error)
    }
}

export async function GetAllGroupsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        let groups = await GetUsersGroups(req.user._id);
        res.status(200).send({ groups });
    } catch (error) {
        next(error)
    }
}

export async function GetGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id);
        if (!Types.ObjectId.isValid(id) || !req.params.id) {
            throw new AppError("Could not find group with provided id!", 404)
        }

        let group: Group | null = await GetGroup(req.user._id, id);
        if (!group) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).json({ group: group });
    } catch (error) {
        next(error)
    }
}

export async function UpdateGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const group: IGroup | null = await UpdateGroup(req.group);
        if (group === null) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).json({ message: "Group updated!", group: group });
    } catch (error) {
        next(error)
    }
}

export async function DeleteGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id);
        if (!Types.ObjectId.isValid(id) || !req.params.id) {
            throw new AppError("Could not find group with provided id!", 404)
        }

        const group: Group | null = await DeleteGroup(req.user._id, id);
        if (!group) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).json({ message: "Group deleted!", group: group });
    } catch (error) {
        next(error)
    }
}
