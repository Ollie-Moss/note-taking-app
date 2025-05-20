import { configureStore } from '@reduxjs/toolkit'
import groupReducer from './reducers/groupReducer'
import noteReducer from './reducers/noteReducer'

const reducer = {
    groups: groupReducer,
    notes: noteReducer
}

export const store = configureStore({
    reducer,
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
