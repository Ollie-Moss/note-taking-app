import { SetStateAction, useEffect, useRef } from "react";

// Provided with a default search query
// Updates given search query upon input
export default function SearchBar({ searchQuery, setSearchQuery }:
    {
        searchQuery: string,
        setSearchQuery: React.Dispatch<SetStateAction<string>>
    }) {
    const InputRef = useRef<HTMLInputElement | null>(null);
    function searchChanged(e: React.FormEvent<HTMLInputElement>) {
        setSearchQuery(e.currentTarget.value);
    }

    useEffect(() => {
        InputRef.current?.focus();
    }, [InputRef]);

    return (
        <div className="bg-bg p-4 rounded-lg">
            <input
                ref={InputRef}
                onChange={searchChanged}
                defaultValue={searchQuery}
                className="w-full bg-transparent border-0 border-b-2 border-white text-white placeholder-white focus:outline-none focus:border-white"
            />
        </div>
    )
}
