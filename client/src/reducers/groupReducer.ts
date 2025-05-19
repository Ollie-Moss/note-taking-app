import { PayloadAction } from "@reduxjs/toolkit";
import { Group } from "../models/group";

export function groupReducer(state: { [key: string]: Group } = {}, action: PayloadAction<{ group?: Group, id?: string }>) {
    const newGroups = { ...state }
    const newGroup = action.payload.group;
    const id = action.payload.id;
    switch (action.type) {
        case 'group/update':
            newGroups[id] = { ...newGroups[id], ...newGroup }
            return newGroups;
        case 'group/add':
            newGroups[newGroup._id] = newGroup
            return newGroups
        case 'group/delete':
            delete newGroups[id]
            return newGroups
        default:
            return state;
    }
}
