import { createAsyncThunk, createSelector, createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Group, NewGroup } from "../models/group";
import { CreateGroup, DeleteGroup, GetGroups, MoveGroup, UpdateGroup } from "../controllers/groupController";
import { RootState } from "../store";
import { updateNoteAsync } from "./noteSlice";

// Contains all logic pertaining to the groups state in redux
// Note: Replicates all business logic

// Group action type
export type GroupAction<T = Group> = PayloadAction<
    { group?: T, id?: string }>

// Group State type
export interface Groups {
    [key: string]: Group
}

const initialState: Groups = {}

// Async Thunks

// Fetch all groups from server
export const fetchGroupsAsync = createAsyncThunk("groups/fetchAllAsync", async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    return await GetGroups(token)
})

// Create a new group
export const createGroupAsync = createAsyncThunk("groups/createAsync", async (_, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    const group: Group = NewGroup();
    return { group: await CreateGroup(group, token) }
})

// Update a group
export const updateGroupAsync = createAsyncThunk("groups/updateAsync", async ({ id, group }: { id: string, group: Partial<Group> }, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    const newGroup = await UpdateGroup(id, group, token)
    return { id, group: newGroup }
})

// Move a group
export const moveGroupAsync = createAsyncThunk("groups/moveAsync", async ({ id, targetId, position, finalPosition }: { id: string, targetId: string, position: 'before' | 'after', finalPosition: number }, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    const newNote = await MoveGroup(id, targetId, position, token)
    return { id, note: newNote }
})

// Move a group and regroup to its target parent 
export const moveGroupAndMaybeRegroupAsync = createAsyncThunk("groups/moveAndRegroupAsync", async ({ id, targetId, position }: { id: string, targetId: string, position: 'before' | 'after' }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const notes = state.notes;
    const groups = state.groups;
    const current = groups[id];
    const target = groups[targetId] || notes[targetId]

    if (!current || !target) return;

    if (checkInGroup(target.parentId, id, Object.values(groups))) {
        return
    }

    // Change parent if needed
    if (current.parentId !== target.parentId) {
        await dispatch(updateGroupAsync({ id, group: { parentId: target.parentId } }));
    }
    // Recalculate position
    const allEntities = [...Object.values(groups), ...Object.values(notes)]
        .filter(item => item.parentId == target.parentId)
        .sort((a, b) => a.position - b.position)

    let finalPosition = current.position;

    if (position == "before") {
        const index = allEntities.findIndex(group => group._id == target._id)
        if (index == 0 || allEntities.length <= 1) {
            finalPosition = target.position / 2;
        } else {
            finalPosition = (allEntities[index - 1].position + target.position) / 2
        }
    }
    if (position == "after") {
        const index = allEntities.findIndex(group => group._id == target._id)
        if (index == allEntities.length - 1) {
            finalPosition = target.position + 100;
        } else {
            finalPosition = (allEntities[index + 1].position + target.position) / 2
        }
    }
    await dispatch(moveGroupAsync({ id, targetId, position, finalPosition }));
})

// Delete a group and all its children recursively
export const deleteGroupAndChildrenAsync = createAsyncThunk("groups/deleteRecursive", async (id: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const groups = state.groups;
    const group = groups[id]
    for (const childId of group.children) {
        await dispatch(deleteGroupAsync(childId))
    }
    await dispatch(deleteGroupAsync(id))
})

// Delete a single group
export const deleteGroupAsync = createAsyncThunk("groups/deleteAsync", async (id: string, { getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    return { id: await DeleteGroup(id, token).then(group => group._id) }
})

// Utility to check if a group or note is within another group (prevents circular nesting)
function checkInGroup(targetId: string, groupId: string, groups: Group[]): boolean {
    const group = groups.find(group => group._id == groupId)
    if (targetId == groupId) {
        return true
    }
    for (const childId of group.children) {
        if (childId == targetId) {
            return true
        }
        if (checkInGroup(targetId, childId, groups)) {
            return true
        }
    }
    return false
}
export const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        // When all groups are fetched
        builder.addCase(fetchGroupsAsync.fulfilled, (state, action: PayloadAction<Group[]>) => {
            for (const group of action.payload) {
                state[group._id] = group;
            }
        })
        // When a new group is created
        builder.addCase(createGroupAsync.fulfilled, (state, action: GroupAction) => {
            state[action.payload.group._id] = action.payload.group
        })
        // Optimistically update position on move
        builder.addCase(moveGroupAsync.pending, (state, action) => {
            state[action.meta.arg.id].position = action.meta.arg.finalPosition
        })
        // Optimistically update group properties
        builder.addCase(updateGroupAsync.pending, (state, action) => {
            const updates = action.meta.arg.group;
            const id = action.meta.arg.id;

            if (checkInGroup(updates.parentId, id, Object.values(state))) {
                delete updates.parentId;
            }
            state[id] = { ...state[id], ...action.meta.arg.group }

            if (!updates.hasOwnProperty("parentId")) return
            for (const group of Object.values(state)) {
                // remove note from group if parent has changed
                if (group.children.includes(id) && group._id != updates.parentId) {
                    state[group._id].children.splice(group.notes.indexOf(group._id), 1);
                }
                // add note to new group
                if (group._id == updates.parentId && !group.children.includes(id)) {
                    state[group._id].children.push(id)
                }
            }

        })
        // Optimistically remove group on delete
        builder.addCase(deleteGroupAsync.pending, (state, action) => {
            const id = action.meta.arg;
            delete state[id]
        })

        // Handle note updates that change group parent
        builder.addCase(updateNoteAsync.pending, (state, action) => {
            const updates = action.meta.arg.note;
            const noteId = action.meta.arg.id;

            if (!updates.hasOwnProperty("parentId")) return
            for (const group of Object.values(state)) {
                // remove note from group if parent has changed
                if (group.notes.includes(noteId) && group._id != updates.parentId) {
                    state[group._id].notes.splice(group.notes.indexOf(noteId), 1);
                }
                // add note to new group
                if (group._id == updates.parentId && !group.notes.includes(noteId)) {
                    state[group._id].notes.push(noteId)
                }
            }
        })
    },
});

export default groupSlice.reducer;
