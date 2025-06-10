import { useDispatch } from "react-redux"
import { AppDispatch } from "./store"
import { useEffect } from "react"
import { ToastProvider } from "./lib/toastProvider"
import { ConfirmationProvider } from "./lib/confirmationProvider"
import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./pages/home/homePage"
import Notes from "./pages/notes/notesPage"
import Login from "./pages/auth/loginPage"
import Error from "./pages/error/errorPage"
import { SidebarProvider } from "./lib/sidebarProvider"
import Signup from "./pages/auth/signupPage"
import { fetchUserAction } from "./slices/userSlice"

// Main App
// Global providers 
// Routing
export default function App() {
    const dispatch = useDispatch<AppDispatch>()

    // Get user data
    useEffect(() => {
        dispatch(fetchUserAction());
    }, [dispatch]);

    return (
        <ToastProvider>
            <ConfirmationProvider>
                <SidebarProvider>
                    <BrowserRouter>
                        <Routes>

                            <Route path="/" element={<Home />} />
                            <Route path="/notes">
                                <Route path="" element={<Notes home={false} />} />
                                <Route path="home" element={<Notes home={true} />} />
                            </Route>
                            <Route path="/auth">
                                <Route path="login" element={<Login />} />
                                <Route path="signup" element={<Signup />} />
                            </Route >

                            <Route path="/*" element={<Error />} />
                        </Routes>
                    </BrowserRouter>
                </SidebarProvider>
            </ConfirmationProvider>
        </ToastProvider>
    )
}
