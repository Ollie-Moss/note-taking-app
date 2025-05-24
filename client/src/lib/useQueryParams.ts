import { useMemo } from "react";
import { useLocation } from "react-router";

// Custom hook for getting the current search query
export function useQueryParams() {
    const { search } = useLocation();

    // Only recaluclate when the search query changes
    // Returns URLSearchParams object for methods like 'has()'
    return useMemo(() => new URLSearchParams(search), [search]);
}
