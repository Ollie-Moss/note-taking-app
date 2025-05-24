import { configureStore } from '@reduxjs/toolkit'
import noteReducer from './slices/noteSlice'
import groupReducer from './slices/groupSlice'

// reducers
const reducer = {
    groups: groupReducer,
    notes: noteReducer
}

// setup redux store
export const store = configureStore({
    reducer,
})

// Docs: https://redux-toolkit.js.org/tutorials/typescript
// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
