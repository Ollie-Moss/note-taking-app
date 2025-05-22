import React, { createContext, ReactNode, SetStateAction, useContext, useRef, useState } from "react";

const sidebarContext = createContext<{
    isSidebarOpen: boolean,
    toggleSidebar: () => void,
    closeSidebarIfMobile: () => void,
    setIsSidebarOpen: React.Dispatch<SetStateAction<boolean>>
}>({
    isSidebarOpen: false,
    toggleSidebar: function(): void {
        throw new Error("Function not implemented.");
    },
    setIsSidebarOpen: function(value: React.SetStateAction<boolean>): void {
        throw new Error("Function not implemented.");
    },
    closeSidebarIfMobile: function(): void {
        throw new Error("Function not implemented.");
    }
})

export function SidebarProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    function toggleSidebar() {
        setIsSidebarOpen(prev => !prev)
    };

    function closeSidebarIfMobile() {
        if (!window.matchMedia('(min-width: 1024px)').matches) {
            setIsSidebarOpen(false)
        }
    }

    return (
        <sidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebarIfMobile, setIsSidebarOpen }}>
            {children}
        </sidebarContext.Provider>
    )
}

export function useSidebar() {
    return useContext(sidebarContext)
}
