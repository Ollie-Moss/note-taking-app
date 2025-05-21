import axios from "axios";
import { BASE_URL, TEST_UID } from "../lib/apiConfig";
import { Group } from "../models/group";

export async function GetGroups(uid: string = TEST_UID): Promise<Group[]> {
    try {
        const res = await axios.get(`${BASE_URL}/group`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        const groups: Group[] = res.data.groups;

        return groups;
    } catch (error: unknown) {
        throw error;
    }
}

export async function CreateGroup(group: Group, uid: string = TEST_UID): Promise<Group> {
    try {
        const res = await axios.post(`${BASE_URL}/group`, { group: { ...group, uid: uid } },
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        const newGroup: Group = res.data.group;
        return newGroup;
    } catch (error: unknown) {
        throw error;
    }
}

export async function UpdateGroup(id: string, group: Partial<Group>, uid: string = TEST_UID): Promise<Group> {
    try {
        const res = await axios.patch(`${BASE_URL}/group`, { group: { _id: id, ...group } },
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        const newGroup: Group = res.data.group;
        return newGroup;
    } catch (error: unknown) {
        throw error;
    }
}

export async function MoveGroup(id: string, targetId: string, position: 'before' | 'after', uid: string = TEST_UID): Promise<Group> {
    try {
        const updatedGroup = await axios.patch(`${BASE_URL}/group/move?targetId=${targetId}&position=${position}`, { group: { _id: id } },
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                },
            })
            .then(res => {
                return res.data.group as Group;
            })
        return updatedGroup
    } catch (error: unknown) {
        throw error
    }
}

export async function DeleteGroup(id: string, uid: string = TEST_UID): Promise<Group> {
    try {
        const res = await axios.delete(`${BASE_URL}/group/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${uid}`
                }
            });
        const group: Group = res.data.group;
        return group;
    } catch (error: unknown) {
        throw error;
    }
}
