import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserState } from "../slices/userSlice";
import { User } from "../models/user";


export type UserSelectorState = {
    loading: boolean,
    error: boolean,
    user: User | null | undefined
}

export const userSelector = createSelector(
    (state: RootState) => state.user,
    (userState: UserState) => {
        const result: UserSelectorState =
        {
            loading: userState.status == 'loading',
            error: userState.status == 'error',
            user: userState.user
        };
        return result as UserSelectorState;
    }
);
