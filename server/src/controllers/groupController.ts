import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import { groupService } from "../services/services";

// ----- API Route Handlers ------

export async function MoveGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const group = groupService.move(req.group._id.toString(), req.body.beforeId)
        res.status(200).send({ message: "Group moved!", group: group });
        if (!group) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
    } catch (error) {
        next(error)
    }

}

export async function CreateGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const group = groupService.create(req.group)
        res.status(200).send({ message: "Group created!", group: group });
    } catch (error) {
        next(error)
    }
}

export async function GetAllGroupsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        let groups = groupService.findGroups({
            parentId: req.params.root ? null : undefined,
            withNotes: req.query.withNotes ? true : false,
            withChildren: req.query.withChildren ? true : false,
        });
        res.status(200).send({
            groups: groups,
        });
    } catch (error) {
        next(error)
    }
}

export async function GetGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.params.id) {
            throw new AppError("Id is required!", 404)
        }
        const group = groupService.findGroup(req.params.id, {
            withNotes: req.query.withNotes ? true : false,
            withChildren: req.query.withChildren ? true : false,
        })
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
        const group = groupService.update(req.group._id.toString(), req.group)
        if (!group) {
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
        if (!req.params.id) {
            throw new AppError("Id is required!", 404)
        }
        const group = groupService.delete(req.params.id)
        if (!group) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).json({ message: "Group deleted!", group: group });
    } catch (error) {
        next(error)
    }
}
