import { createContext, ReactNode, useContext, useRef, useState } from "react";
import Search from "../components/search";

// Provides an api for the Search Component 
// Simple API to toggle the modal 

// Create a context with return type
// Default implementation throws an error to ensure the provider is used
const searchContext = createContext<{ OpenSearch: () => void, CloseSearch: () => void }>({
    OpenSearch: function(): void {
        throw new Error("Function not implemented.");
    },
    CloseSearch: function(): void {
        throw new Error("Function not implemented.");
    }
})

export function SearchProvider({ children }: Readonly<{ children: ReactNode }>) {
    // state
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

    // Function to open the search modal
    function OpenSearch() {
        setIsSearchVisible(true)
    }
    // Function to close the search modal
    function CloseSearch() {
        setIsSearchVisible(false)
    }

    return (
        <searchContext.Provider value={{ OpenSearch, CloseSearch }}>
            {children}
            <Search isOpen={isSearchVisible} closeSearch={CloseSearch} />
        </searchContext.Provider>
    )
}

export function useSearch() {
    return useContext(searchContext)
}
