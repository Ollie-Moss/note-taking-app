import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserState } from "../slices/userSlice";


export const userSelector = createSelector((state: RootState) => state.user, (userState: UserState) => {
    const result = { loading: false, error: false, user: userState.user };

    if (userState.status == 'loading') result.loading = true;
    if (userState.status == 'error') result.error = true;

    return result;
});
