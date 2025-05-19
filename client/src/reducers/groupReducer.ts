import { createSlice, PayloadAction, } from "@reduxjs/toolkit";
import { Group } from "../models/group";

export type GroupAction<T = Group> = PayloadAction<{ group?: T, id?: string }>;

export interface Groups {
    [key: string]: Group
}

const initialState: Groups = {}

export const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {
        create: (state, action: GroupAction) => {
            state[action.payload.id] = action.payload.group
        },

        update: (state, action: GroupAction<Partial<Group>>) => {
            const id = action.payload.id;
            state[id] = { ...state[id], ...action.payload.group }

        },
        deleteGroup: (state, action: GroupAction) => {
            delete state[action.payload.id]
        }
    }
});

export const { create, update, deleteGroup } = groupSlice.actions;
export default groupSlice.reducer;
