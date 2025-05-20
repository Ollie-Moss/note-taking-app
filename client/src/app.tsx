import { useDispatch } from "react-redux"
import { AppDispatch } from "./store"
import { fetchGroupsAsync } from "./reducers/groupReducer"
import { fetchNotesAsync } from "./reducers/noteReducer"
import { useEffect } from "react"
import { ToastProvider } from "./lib/toastProvider"
import { ConfirmationProvider } from "./lib/confirmationProvider"
import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/home/homePage"
import Notes from "./pages/notes/notesPage"
import Login from "./pages/auth/loginPage"
import Error from "./pages/error/errorPage"

export default function App() {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchGroupsAsync())
        dispatch(fetchNotesAsync())

    }, [dispatch])

    return (
        <ToastProvider>
            <ConfirmationProvider>
                <BrowserRouter>
                    <Routes>

                        <Route path="/" element={<Home />} />
                        <Route path="/notes">
                            <Route path="" element={<Notes home={false} />} />
                            <Route path="home" element={<Notes home={true} />} />
                        </Route>
                        <Route path="/login" element={<Login />} />

                        <Route path="/*" element={<Error />} />
                    </Routes>
                </BrowserRouter>
            </ConfirmationProvider>
        </ToastProvider>
    )
}
