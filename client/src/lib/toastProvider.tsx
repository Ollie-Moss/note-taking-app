import { createContext, ReactNode, useContext, useState } from "react"
import ToastNotification from "../components/toastNotification"
import { v4 as uuidv4 } from 'uuid'

export type Toast = { id?: string, message: string, type: string, length?: number }

const toastContext = createContext<{ createNotification: (toast: Toast) => void, closeToast: (toast: Toast) => void }>({
    createNotification: function(toast: Toast): void {
        throw new Error("Function not implemented.");
    },
    closeToast: function(toast: Toast) {
        throw new Error("Function not implemented.");
    }
})

export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [toasts, setToasts] = useState<Toast[]>([])

    function createNotification(toast: Toast) {
        setToasts(prev => [...prev, { ...toast, id: uuidv4() }])
    }
    function closeToast(toast: Toast) {
        setToasts(prev => prev.filter(_toast => _toast.id !== toast.id))
    }

    return (
        <toastContext.Provider value={{ createNotification, closeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <ToastNotification
                        key={toast.id}
                        toast={toast} />
                ))}
            </div>
        </toastContext.Provider>
    )
}

export function useToast() {
    return useContext(toastContext)
}
