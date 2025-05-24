import { createContext, ReactNode, useContext, useRef, useState } from "react";
import ConfirmModal from "../components/confirmation"

// Provides a confirmation modal
// Simple API to display the confirmation modal 
// and await the user's confirmation (true/false)

// Create a context with return type
// Default implementation throws an error to ensure the provider is used
const confirmationContext = createContext<{ Confirm: (message: string) => Promise<boolean> }>({
    Confirm: function(message: string): Promise<boolean> {
        throw new Error("Function not implemented.");
    }
})

// Provider component that wraps its children and provides confirmation functionality
export function ConfirmationProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const confirmRef = useRef((value: boolean) => { });

    // Called when the user confirms the action
    const handleConfirm = () => {
        setIsModalOpen(false);
        confirmRef.current(true);
    }
    // Called when the user cancels the action
    const handleCancel = () => {
        setIsModalOpen(false);
        confirmRef.current(false);
    };

    // Function to be called from anywhere in the app to show the confirmation modal
    // Returns promise of the resulting confirmation as bool
    function Confirm(message: string): Promise<boolean> {
        setIsModalOpen(true);
        setMessage(message);
        return new Promise((resolve: (value: boolean) => void) => {
            confirmRef.current = resolve;
        })
    }

    return (
        <confirmationContext.Provider value={{ Confirm }}>
            {children}
            <ConfirmModal
                isOpen={isModalOpen}
                message={message}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </confirmationContext.Provider>
    )
}

// Custom hook to use the context
export function useConfirm() {
    return useContext(confirmationContext)
}
