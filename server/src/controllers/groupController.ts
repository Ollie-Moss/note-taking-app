import { Request, Response, NextFunction } from "express";
import { Group, GroupModel, IGroup } from "../models/groupModel";
import { Types } from "mongoose";
import { AppError } from "../middlewares/errorHandler";

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
        let groups: Group[] = await GetUsersGroups(req.user._id);
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

// ---- Controller Methods ----

async function GetPostionBetweenGroup(uid: Types.ObjectId, groupAId: Types.ObjectId, groupBId: Types.ObjectId): Promise<number> {
    const groupA: IGroup | null = await GroupModel.findOne({ _id: groupAId, uid: uid })
    const groupB: IGroup | null = await GroupModel.findOne({ _id: groupBId, uid: uid })
    if (!groupA || !groupB) {
        return await GetLastGroupPostition(uid);
    }
    const newPosition = (groupA.position + groupB.position) / 2
    return newPosition;
}

async function GetLastGroupPostition(uid: Types.ObjectId): Promise<number> {
    const lastGroup: IGroup[] = await GroupModel.find({ uid }).sort({ position: -1 }).limit(1)
    let newPosition = 100;
    if (lastGroup.length > 0) {
        newPosition += lastGroup[0].position;
    }
    return newPosition
}

export async function InsertGroupBetweenGroups(group: Group, groupAId: Types.ObjectId, groupBId: Types.ObjectId): Promise<Group | null> {
    group.position = await GetPostionBetweenGroup(groupAId, groupBId, group.uid);
    return await CreateGroup(group);
}

export async function AppendGroup(group: Group): Promise<Group | null> {
    group.position = await GetLastGroupPostition(group.uid);
    return await CreateGroup(group);
}

export async function MoveGroupBetween(uid: Types.ObjectId, groupId: Types.ObjectId, groupAId: Types.ObjectId, groupBId: Types.ObjectId): Promise<Group | null> {
    const group: Group | null = await GetGroup(uid, groupId);
    if (!group) return null;

    group.position = await GetPostionBetweenGroup(uid, groupAId, groupBId);

    const updatedGroup: Group | null = await UpdateGroup(group);
    return updatedGroup;
}

export async function MoveGroupToLast(uid: Types.ObjectId, groupId: Types.ObjectId) {
    const group: Group | null = await GetGroup(uid, groupId);
    if (!group) return null;

    group.position = await GetLastGroupPostition(uid);

    const updatedGroup: Group | null = await UpdateGroup(group);
    return updatedGroup;
}

export async function CreateGroup(group: Group): Promise<Group | null> {
    // Generate new object id
    group = { ...group, _id: new Types.ObjectId() }

    const newGroup: Group | null = await GroupModel.create(group)
        .then(data => data.toObject({ versionKey: false }));
    return newGroup;
}

export async function GetAllGroups(): Promise<IGroup[]> {
    const groups: IGroup[] = await GroupModel.find({})
        .then(data => data.map(group => group.toObject({ versionKey: false })));
    return groups;
}

export async function GetUsersGroups(uid: Types.ObjectId): Promise<Group[]> {
    const groups: Group[] = await GroupModel.find({ uid }).sort({ position: 1 })
        .then(data => data.map(group => group.toObject({ versionKey: false })));
    return groups;
}

export async function GetGroup(uid: Types.ObjectId, groupId: Types.ObjectId): Promise<Group | null> {
    const group: Group | null = await GroupModel.findOne({ _id: groupId, uid: uid })
        .then(data => data?.toObject({ versionKey: false }) ?? null)
    return group;
};

export async function UpdateGroup(group: Group): Promise<Group | null> {
    const updatedGroup: Group | null = await GroupModel.findOneAndUpdate({ _id: group._id, uid: group.uid }, group, { new: true })
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return updatedGroup;
}

export async function DeleteGroup(uid: Types.ObjectId, groupId: Types.ObjectId): Promise<Group | null> {
    const group: Group | null = await GroupModel.findOneAndDelete({ _id: groupId, uid: uid })
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return group;
}
