import React, { createContext, ReactNode, SetStateAction, useContext, useRef, useState } from "react";

// Provides an api for the Sidebar Component 
// Simple API to:
// Toggle the modal
// Close if on mobile screen size
//

// Create a context with return type
// Default implementation throws an error to ensure the provider is used
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

// Note: Does not contain the sidebar component as
// it required a specific place in the hierarchy
export function SidebarProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    // Toggle sidebar open/closed
    function toggleSidebar() {
        setIsSidebarOpen(prev => !prev)
    };

    // Close sidebar if on a mobile screen (less than 1024px width)
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
