import { createAsyncThunk, createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Group, NewGroup } from "../models/group";
import { CreateGroup, DeleteGroup, GetGroups, UpdateGroup } from "../controllers/groupController";

export type GroupAction<T = Group> = PayloadAction<{ group?: T, id?: string }>;

export interface Groups {
    [key: string]: Group
}

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
export const deleteGroupAsync = createAsyncThunk("groups/deleteAsync", async (id: string) => {
    return { id: await DeleteGroup(id).then(group => group._id) }
})

export const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        createGroup: (state, action: GroupAction) => {
            state[action.payload.id] = action.payload.group
        },
        updateGroup: (state, action: GroupAction<Partial<Group>>) => {
            const id = action.payload.id;
            state[id] = { ...state[id], ...action.payload.group }

        },
        deleteGroup: (state, action: GroupAction) => {
            delete state[action.payload.id]
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchGroupsAsync.fulfilled, (state, action: PayloadAction<Group[]>) => {
            for (const group of action.payload) {
                state[group._id] = group;
            }
        })
        builder.addCase(createGroupAsync.fulfilled, (state, action: GroupAction) => {
            state[action.payload.id] = action.payload.group
        })
        builder.addCase(updateGroupAsync.fulfilled, (state, action: GroupAction) => {
            const id = action.payload.id;
            state[id] = { ...state[id], ...action.payload.group }
        })
        builder.addCase(deleteGroupAsync.fulfilled, (state, action: GroupAction) => {
            delete state[action.payload.id]
        })

    },
});

export const { createGroup, updateGroup, deleteGroup } = groupSlice.actions;
export default groupSlice.reducer;
