import { Request, Response, NextFunction } from "express";
import { Group, GroupModel, IGroup } from "../models/groupModel";
import { Types } from "mongoose";
import { AppError } from "../middlewares/errorHandler";

async function GetPostionBetweenGroup(groupAId: string, groupBId: string, uid: string): Promise<number> {
    const groupA: IGroup | null = await GroupModel.findOne({ _id: groupAId, uid: uid })
    const groupB: IGroup | null = await GroupModel.findOne({ _id: groupBId, uid: uid })
    if (!groupA || !groupB) {
        return await GetLastGroupPostition(uid);
    }
    const newPosition = (groupA.position + groupB.position) / 2
    return newPosition;
}

async function GetLastGroupPostition(uid: string): Promise<number> {
    const lastGroup: IGroup[] = await GroupModel.find({ uid }).sort({ position: -1 }).limit(1)
    let newPosition = 100;
    if (lastGroup.length > 0) {
        newPosition += lastGroup[0].position;
    }
    return newPosition
}

export async function InsertGroupBetweenGroups(group: IGroup, groupAId: string, groupBId: string, uid: string) {
    group.position = await GetPostionBetweenGroup(groupAId, groupBId, uid);
    return await CreateGroup(group);
}

export async function AppendGroup(group: IGroup) {
    group.position = await GetLastGroupPostition(group.uid.toString());
    return await CreateGroup(group);
}

export async function MoveGroupToLast(groupId: string, groupAId: string, groupBId: string, uid: string) {
    const group: IGroup & { _id: Types.ObjectId } | null = await GetGroup(groupId, uid);
    if (!group) return null;

    group.position = await GetPostionBetweenGroup(groupAId, groupBId, uid);
    const updatedGroup: IGroup | null = await GroupModel.findOneAndUpdate({ _id: group._id, uid: uid }, group)
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return updatedGroup;

}
export async function MoveGroupBetween(groupId: string, uid: string) {
    const group: IGroup & { _id: Types.ObjectId } | null = await GetGroup(groupId, uid);
    if (!group) return null;

    group.position = await GetLastGroupPostition(uid);
    const updatedGroup: IGroup | null = await GroupModel.findOneAndUpdate({ _id: group._id, uid: uid }, group)
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return updatedGroup;
}

export async function CreateGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.body?.group) return next();

        const uid: string = req.user._id;
        const newGroup: IGroup = req.body.group as IGroup;

        if (!Types.ObjectId.isValid(newGroup.uid)) {
            throw new AppError("Invalid uid provided!", 404);
        }

        const validGroup: IGroup = {
            title: newGroup.title,
            notes: [],
            uid: new Types.ObjectId(uid),
            position: 0,
            parentId: null
        }
        const group: IGroup = await CreateGroup(validGroup);
        res.status(200).send({ message: "Group created!", group: group });
    } catch (error) {
        next(error)
    }
}

export async function CreateGroup(group: IGroup): Promise<IGroup> {
    console.log(group);
    const newGroup: IGroup = await GroupModel.create(group)
        .then(data => data.toObject({ versionKey: false }));
    return newGroup;
}

// ----- READ ------

export async function GetAllGroupsHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const uid: string = req.user._id;
        let groups: IGroup[] = await GetAllGroupsForUser(uid);
        res.status(200).send({ groups: groups });
    } catch (error) {
        next(error)
    }
}

export async function GetAllGroups(): Promise<IGroup[]> {
    const groups: IGroup[] = await GroupModel.find({})
        .then(data => data.map(group => group.toObject({ versionKey: false })));
    return groups;
}
export async function GetAllGroupsForUser(uid: string): Promise<IGroup[]> {
    const groups: IGroup[] = await GroupModel.find({ uid: uid })
        .then(data => data.map(group => group.toObject({ versionKey: false })));
    return groups;
}


export async function GetGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: string = req.params.id;
        let group: IGroup | null = await GetGroup(req.user._id, id);
        if (group === null) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).json({ group: group });
    } catch (error) {
        next(error)
    }
}

export async function GetGroup(uid: string, id: string): Promise<IGroup & { _id: Types.ObjectId } | null> {
    if (!Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid group id provided!", 404);
    }
    const group: IGroup & { _id: Types.ObjectId } | null = await GroupModel.findOne({ _id: id, uid: uid })
        .then(data => data?.toObject({ versionKey: false }) ?? null)
    return group;
};


// ----- UPDATE ------

export async function UpdateGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const newGroup: Group = req.body.group as Group;
        const group: IGroup | null = await UpdateGroup(req.user._id, newGroup);
        if (group === null) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).json({ message: "Group updated!", group: group });
    } catch (error) {
        next(error)
    }
}

export async function UpdateGroup(uid: string, group: Group): Promise<IGroup | null> {
    const updatedGroup: IGroup | null = await GroupModel.findOneAndUpdate({ _id: group._id, uid: uid }, group)
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return updatedGroup;
}


// ----- DELETE ------

export async function DeleteGroupHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const id: string = req.params.id;
        const group: IGroup | null = await DeleteGroup(req.user._id, id);
        if (group === null) {
            res.status(404).json({ message: "Group not found!" })
            return;
        }
        res.status(200).json({ message: "Group deleted!", group: group });
    } catch (error) {
        next(error)
    }
}

export async function DeleteGroup(uid: string, id: string): Promise<IGroup | null> {
    const group: IGroup | null = await GroupModel.findOneAndDelete({ _id: id, uid: uid })
        .then(data => data?.toObject({ versionKey: false }) ?? null);
    return group;
}
