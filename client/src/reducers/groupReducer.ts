import { createAsyncThunk, createSelector, createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Group, NewGroup } from "../models/group";
import { CreateGroup, DeleteGroup, GetGroups, MoveGroup, UpdateGroup } from "../controllers/groupController";
import { RootState } from "../store";
import { moveNoteAsync, updateNoteAsync } from "./noteReducer";
import { act } from "react";
import { activeAnimations } from "motion/react";

export type GroupAction<T = Group> = PayloadAction<
    { group?: T, id?: string }>

export interface Groups {
    [key: string]: Group
}

export const groupArraySelector = createSelector((state: RootState) => state.groups, groups => {
    return Object.values(groups)
});
export const rootGroupSelector = createSelector((state: RootState) => state.groups, groups => {
    return Object.values(groups).filter(group => !group.parentId)
});

export const groupMapSelector = (state: RootState) => state.groups

const initialState: Groups = {}

export const fetchGroupsAsync = createAsyncThunk("groups/fetchAllAsync", async () => {
    return await GetGroups()
})
export const createGroupAsync = createAsyncThunk("groups/createAsync", async () => {
    const group: Group = NewGroup();
    return { group: await CreateGroup(group) }
})
export const updateGroupAsync = createAsyncThunk("groups/updateAsync", async ({ id, group }: { id: string, group: Partial<Group> }) => {
    const newGroup = await UpdateGroup(id, group)
    return { id, group: newGroup }
})
export const moveGroupAsync = createAsyncThunk("groups/moveAsync", async ({ id, targetId, position, finalPosition }: { id: string, targetId: string, position: 'before' | 'after', finalPosition: number }) => {
    const newNote = await MoveGroup(id, targetId, position)
    return { id, note: newNote }
})

export const moveGroupAndMaybeRegroupAsync = createAsyncThunk("groups/moveAndRegroupAsync", async ({ id, targetId, position }: { id: string, targetId: string, position: 'before' | 'after' }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const notes = state.notes;
    const groups = state.groups;
    const current = groups[id];
    const target = groups[targetId] || notes[targetId]

    if (!current || !target) return;

    if (current.parentId !== target.parentId) {
        await dispatch(updateGroupAsync({ id, group: { parentId: target.parentId } }));
    }

    if (!target || !current) return;

    const allEntities = [...Object.values(groups), ...Object.values(notes)].filter(item => item.parentId == target.parentId).sort((a, b) => a.position - b.position)

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
export const deleteGroupAndChildrenAsync = createAsyncThunk("groups/deleteRecursive", async (id: string, { dispatch, getState }) => {
    const state = getState() as RootState;
    const groups = state.groups;
    const group = groups[id]
    for (const childId of group.children) {
        await dispatch(deleteGroupAsync(childId))
    }
    await dispatch(deleteGroupAsync(id))
})

export const deleteGroupAsync = createAsyncThunk("groups/deleteAsync", async (id: string) => {
    return { id: await DeleteGroup(id).then(group => group._id) }
})

export const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(fetchGroupsAsync.fulfilled, (state, action: PayloadAction<Group[]>) => {
            for (const group of action.payload) {
                state[group._id] = group;
            }
        })
        builder.addCase(createGroupAsync.fulfilled, (state, action: GroupAction) => {
            state[action.payload.group._id] = action.payload.group
        })
        builder.addCase(moveGroupAsync.pending, (state, action) => {
            state[action.meta.arg.id].position = action.meta.arg.finalPosition
        })
        builder.addCase(updateGroupAsync.pending, (state, action) => {
            const updates = action.meta.arg.group;
            const id = action.meta.arg.id;
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
        builder.addCase(deleteGroupAsync.pending, (state, action) => {
            const id = action.meta.arg;
            delete state[id]
        })

        // Note updates
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
