import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUser, LoginWithEmailAndPassword, SignUp } from "../controllers/authController";
import { User } from "../models/user";

export type UserState = {
    user?: User,
    status?: 'loading' | 'error'
}

const initialState: UserState = null;

export const fetchUserAction = createAsyncThunk("user/fetch", async (token: string) => {
    return await GetUser(token);
})

export const loginAction = createAsyncThunk("user/login", async ({ email, password }: { email: string, password: string }) => {
    return await LoginWithEmailAndPassword(email, password);
})
export const signupAction = createAsyncThunk("user/signup", async ({ name, email, password }: { name: string, email: string, password }) => {
    return await SignUp(name, email, password);
})

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder.addCase(fetchUserAction.fulfilled, (state, action) => {
            state = { user: action.payload };
        })

        builder.addCase(loginAction.pending, (state, action) => {
            state = { status: "loading" }
        })

        builder.addCase(loginAction.fulfilled, (state, action) => {
            state = { user: action.payload.user };
        })

        builder.addCase(signupAction.pending, (state, action) => {
            state = { status: "loading" }
        })

        builder.addCase(signupAction.fulfilled, (state, action) => {
            state = { user: action.payload.user }
        })
    }
})

export default userSlice.reducer;
