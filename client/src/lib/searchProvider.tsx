import { createContext, ReactNode, useContext, useRef, useState } from "react";
import Search from "../components/search";

const searchContext = createContext<{ OpenSearch: () => void, CloseSearch: () => void }>({
    OpenSearch: function(): void {
        throw new Error("Function not implemented.");
    },
    CloseSearch: function(): void {
        throw new Error("Function not implemented.");
    }
})

export function SearchProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

    function OpenSearch() {
        setIsSearchVisible(true)
    }
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
