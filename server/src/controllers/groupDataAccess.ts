import { Group, GroupModel, IGroup } from "../models/groupModel";
import { Types } from "mongoose";
import { NotePreview } from "../models/noteModel";
import { GetNotesPreviewInGroup } from "./noteDataAccess";

async function GetPostionBetweenGroup(uid: Types.ObjectId, groupAId: Types.ObjectId, groupBId: Types.ObjectId): Promise<number> {
    const groupA: IGroup | null = await GetGroup(uid, groupAId);
    const groupB: IGroup | null = await GetGroup(uid, groupBId);
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

export async function GetUsersGroups(uid: Types.ObjectId): Promise<Group & { notes: NotePreview[] }[]> {
    const groups: Group[] = await GroupModel.find({ uid }).sort({ position: 1 })
        .then(data => data.map(group => group.toObject({ versionKey: false })));

    const groupsHydrated: Group & { notes: NotePreview[] }[] = [] as unknown as Group & { notes: NotePreview[] }[]

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i]
        // only retrieve notes if group is open
        if (!group.open) continue
        const notes: NotePreview[] = await GetNotesPreviewInGroup(uid, group._id);
        groupsHydrated.push({ ...group, notes: notes })
    }
    return groupsHydrated
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
