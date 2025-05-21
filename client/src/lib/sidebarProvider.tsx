import React, { createContext, ReactNode, SetStateAction, useContext, useRef, useState } from "react";

const sidebarContext = createContext<{ isSidebarOpen: boolean, toggleSideBar: () => void, setSideBar: React.Dispatch<SetStateAction<boolean>> }>({
    isSidebarOpen: false,
    toggleSideBar: function(): void {
        throw new Error("Function not implemented.");
    },
    setSideBar: function(value: React.SetStateAction<boolean>): void {
        throw new Error("Function not implemented.");
    }
})

export function SidebarProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const toggleSideBar = () => setIsSidebarOpen(prev => !prev);

    return (
        <sidebarContext.Provider value={{ isSidebarOpen, toggleSideBar, setSideBar: setIsSidebarOpen }}>
            {children}
        </sidebarContext.Provider>
    )
}

export function useSidebar() {
    return useContext(sidebarContext)
}
