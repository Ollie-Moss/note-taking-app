import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import { groupService } from "../services/services";

// ----- API Route Handlers ------

export async function MoveGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.query.targetId) throw new AppError("targetId query parameter is required!", 400)
        if (!req.query.position) throw new AppError("position query parameter is required!", 400)
        if (!(req.query.position == 'before' || req.query.position == 'after')) throw new AppError("position query must be either 'before' or 'after'!", 400)

        const group = await groupService.move(req.group._id.toString(), req.query.targetId.toString(), req.query.position)
        if (!group) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).send({ message: "Group moved!", group: group });
    } catch (error) {
        next(error)
    }

}

export async function CreateGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const group = await groupService.create(req.group)
        res.status(200).send({ message: "Group created!", group: group });
    } catch (error) {
        next(error)
    }
}

export async function GetAllGroupsHandler(req: Request, res: Response, next: NextFunction) {
    console.log("start")
    try {
        let groups = await groupService.findGroups({
            parentId: req.params.root ? null : undefined,
            withNotes: req.query.withNotes ? true : false,
            withChildren: req.query.withChildren ? true : false,
        });
        res.status(200).send({
            groups: groups,
        });
        console.log("end")
    } catch (error) {
        next(error)
    }
}

export async function GetGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.params.id) {
            throw new AppError("Id is required!", 404)
        }
        const group = await groupService.findGroup(req.params.id, {
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
        const group = await groupService.update(req.group._id.toString(), req.group)
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
        const group = await groupService.delete(req.params.id)
        if (!group) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).json({ message: "Group deleted!", group: group });
    } catch (error) {
        next(error)
    }
}
