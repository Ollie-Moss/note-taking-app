import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/home/homePage.tsx'
import Notes from './pages/notes/notesPage.tsx'
import Login from './pages/auth/loginPage.tsx'
import Error from './pages/error/errorPage.tsx'
import { ToastProvider } from './lib/toastProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ToastProvider >
            <BrowserRouter>
                <Routes>

                    <Route path="/" element={<Home />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="/*" element={<Error />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider >
    </StrictMode>
)
