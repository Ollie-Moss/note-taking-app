import axios from "axios";
import { BASE_URL } from "../lib/apiConfig";
import { Group } from "../models/group";
// Provides Wrappers for http requests to group endpoints
// Provides typed return values
// Catches any request errors

// GET 'api/group'
// Returns all a users groups
export async function GetGroups(token: string): Promise<Group[]> {
    try {
        const res = await axios.get(`${BASE_URL}/group`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        const groups: Group[] = res.data.groups;

        return groups;
    } catch (error: unknown) {
        throw error;
    }
}

// POST 'api/group'
// Creates a group
export async function CreateGroup(group: Group, token: string): Promise<Group> {
    try {
        const res = await axios.post(`${BASE_URL}/group`, { group: { ...group, uid: token } },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        const newGroup: Group = res.data.group;
        return newGroup;
    } catch (error: unknown) {
        throw error;
    }
}

// PATCH 'api/group'
// Updates a group
export async function UpdateGroup(id: string, group: Partial<Group>, token: string): Promise<Group> {
    try {
        const res = await axios.patch(`${BASE_URL}/group`, { group: { _id: id, ...group } },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        const newGroup: Group = res.data.group;
        return newGroup;
    } catch (error: unknown) {
        throw error;
    }
}

// PATCH 'api/group/move?groupId&targetId&position'
// Moves a group based on the target and position
export async function MoveGroup(id: string, targetId: string, position: 'before' | 'after', token: string): Promise<Group> {
    try {
        const updatedGroup = await axios.patch(`${BASE_URL}/group/move?groupId=${id}&targetId=${targetId}&position=${position}`, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
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

// DELETE 'api/group/:id'
// Deletes a group
export async function DeleteGroup(id: string, token: string): Promise<Group> {
    try {
        const res = await axios.delete(`${BASE_URL}/group/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        const group: Group = res.data.group;
        return group;
    } catch (error: unknown) {
        throw error;
    }
}
