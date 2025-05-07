import { createContext, ReactNode, useContext, useRef, useState } from "react";
import ConfirmModal from "../components/confirmation"

const confirmationContext = createContext<{ Confirm: (message: string) => Promise<boolean> }>({
    Confirm: function(message: string): Promise<boolean> {
        throw new Error("Function not implemented.");
    }
})

export function ConfirmationProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const confirmRef = useRef((value: boolean) => { });

    const handleConfirm = () => {
        setIsModalOpen(false);
        confirmRef.current(true);
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        confirmRef.current(false);
    };

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

export function useConfirm() {
    return useContext(confirmationContext)
}
