import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/home/homePage.tsx'
import Notes from './pages/notes/notesPage.tsx'
import Login from './pages/auth/loginPage.tsx'
import Error from "./pages/error/errorPage.tsx"

import { ToastProvider } from './lib/toastProvider.tsx'
import { ConfirmationProvider } from './lib/confirmationProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
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
    </StrictMode>
)
