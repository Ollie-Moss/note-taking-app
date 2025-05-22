import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const groupArraySelector = createSelector((state: RootState) => state.groups, groups => {
    return Object.values(groups)
});
export const rootGroupArraySelector = createSelector((state: RootState) => state.groups, groups => {
    return Object.values(groups).filter(group => !group.parentId)
});

export const groupMapSelector = (state: RootState) => state.groups
