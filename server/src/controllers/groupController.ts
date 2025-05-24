import { Request, Response, NextFunction } from "express";
import { AppError } from "../middlewares/errorHandler";
import { groupService } from "../services/services";
import { Types } from "mongoose";

// ----- API Route Handlers ------

// Move a group before or after another note or group
export async function MoveGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("PATCH 'api/group/move'")

        // Validate and log query params
        if (!req.query.groupId) throw new AppError("groupId query paramter is required!", 400)
        console.log(`param groupId: ${req.query.groupId}`)
        if (!req.query.targetId) throw new AppError("targetId query parameter is required!", 400)
        console.log(`param targetId: ${req.query.targetId}`)
        if (!req.query.position) throw new AppError("position query parameter is required!", 400)
        console.log(`param position: ${req.query.position}`)
        if (!(req.query.position == 'before' || req.query.position == 'after')) throw new AppError("position query must be either 'before' or 'after'!", 400)

        console.log("Attempting Move")
        // Attempt Move
        const group = await groupService.move(req.query.groupId.toString(), req.query.targetId.toString(), req.query.position)

        if (!group) throw new AppError("Group not found!", 404);

        console.log("Group moved!")
        console.log("Status: 200 OK");
        res.status(200).send({ message: "Group moved!", group: group });
    } catch (error) {
        console.log("Something went wrong while moving!")
        next(error)
    }

}

// Create a new group
export async function CreateGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("POST 'api/group'")
        if (!req.group) throw new AppError("Group is required!", 400);
        console.log("group: ", req.group)

        // validate the group
        const result = groupService.validate(req.group);
        if (!result.passed) throw new AppError(result.message || "Invalid group provided!", 400);

        console.log("Creating group...")
        const group = await groupService.create(req.group)
        console.log("Group created!")
        console.log("Status: 200 OK");
        res.status(200).send({ message: "Group created!", group: group });
    } catch (error) {
        next(error)
    }
}

// Get all groups, optionally filter by root and include notes/children
export async function GetAllGroupsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("GET 'api/group'")
        if (req.query.root !== undefined
            && typeof req.query.root === "boolean") throw new AppError("root query parameter must be type boolean!", 400)
        console.log(`param root: ${req.query.root || "Not provided"}`)
        if (req.query.withNotes !== undefined
            && typeof req.query.withNotes === "boolean") throw new AppError("withNotes query parameter must be type boolean!", 400)
        console.log(`param withNotes: ${req.query.withNotes || "Not provided"}`)
        if (req.query.withChildren !== undefined
            && typeof req.query.withChildren === "boolean") throw new AppError("withChildren query parameter must be type boolean!", 400)
        console.log(`param withChildren: ${req.query.withChildren || "not provided"}`)

        console.log("Retrieving groups...")
        // Retrieve groups
        let groups = await groupService.findGroups({
            parentId: req.params.root ? null : undefined,
            withNotes: req.query.withNotes ? true : false,
            withChildren: req.query.withChildren ? true : false,
        });

        console.log("Groups found: ", groups);
        console.log("Status: 200 OK");
        res.status(200).send({
            groups: groups,
        });
    } catch (error) {
        next(error)
    }
}

// Get a specific group by ID with optional notes and children
export async function GetGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`GET 'api/group/${req.params.id}'`)
        if (!Types.ObjectId.isValid(req.params.id)) throw new AppError("Group not found!", 404)

        if (req.query.withNotes !== undefined
            && typeof req.query.withNotes === "boolean") throw new AppError("withNotes query parameter must be type boolean!", 400)
        console.log(`param withNotes: ${req.query.withNotes || "Not provided"}`)
        if (req.query.withChildren !== undefined
            && typeof req.query.withChildren === "boolean") throw new AppError("withChildren query parameter must be type boolean!", 400)
        console.log(`param withChildren: ${req.query.withChildren || "not provided"}`)

        console.log("Retrieving group...")
        const group = await groupService.findGroup(req.params.id, {
            withNotes: req.query.withNotes ? true : false,
            withChildren: req.query.withChildren ? true : false,
        })

        if (!group) throw new AppError("Group not found!", 404)

        console.log("Group found: ", group);
        console.log("Status: 200 OK");
        res.status(200).json({ group: group });
    } catch (error) {
        next(error)
    }
}

// Update an existing group
export async function UpdateGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`PATCH 'api/group'`)
        if (!req.group) throw new AppError("Group is required!", 400);
        console.log("group: ", req.group)

        // validate the group
        const result = groupService.validate(req.group);
        if (!result.passed) throw new AppError(result.message || "Invalid group provided!", 400);

        console.log("Updating group...")
        const group = await groupService.update(req.group._id.toString(), req.group)

        if (!group) throw new AppError("Group not found!", 404)

        console.log("Group updated!: ", group);
        console.log("Status: 200 OK");
        res.status(200).json({ message: "Group updated!", group: group });
    } catch (error) {
        next(error)
    }
}

// Delete a group by ID
export async function DeleteGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(`DELETE 'api/group/${req.params.id}'`)
        if (!Types.ObjectId.isValid(req.params.id)) throw new AppError("Group not found!", 404);

        console.log("Deleting group...")
        const group = await groupService.delete(req.params.id)

        console.log("Group !: ", group);
        console.log("Status: 200 OK");
        res.status(200).json({ message: "Group deleted!", group: group });
    } catch (error) {
        next(error)
    }
}
