import { useEffect, useState } from "react";
import { Note } from "../models/note";
import Fuse from "fuse.js"
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { noteArraySelector } from "../selectors/noteSelectors";
import NotePreview from "./notePreview";
import SearchBar from "./searchbar";
import SearchResults from "./searchResults";

export default function Search({ isOpen, closeSearch }: { isOpen: boolean, closeSearch: () => void }) {
    const navigate = useNavigate();

    const notes = useSelector(noteArraySelector);

    const [results, setResults] = useState<Note[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Update search results
    useEffect(() => {
        const fuse = new Fuse(notes as Note[], {
            keys: ['title'],
            threshold: 0.3
        });

        if (searchQuery === "") return setResults(notes as Note[]);
        setResults(fuse.search(searchQuery).map(result => result.item));

    }, [notes, searchQuery])

    // Handles looping selected index
    function changeSelectedIndex(amount: number) {
        setSelectedIndex((prev: number) => {
            const nextIndex = prev + amount;
            const lastIndex = notes.length - 1;

            if (nextIndex > lastIndex) {
                return 0;
            }
            if (nextIndex < 0) {
                return lastIndex;
            }
            return nextIndex;
        })
    }

    // Keyboard Shortcuts
    useEffect(() => {
        if (!isOpen) return;
        function Overrides(e: any): void {
            switch (e.key) {
                case "Tab":
                    e.preventDefault()
                    changeSelectedIndex(1)
                    break;
                case "ArrowUp":
                    changeSelectedIndex(1)
                    break;
                case "ArrowDown":
                    changeSelectedIndex(-1)
                    break;
                case "Escape":
                    e.preventDefault();
                    closeSearch();
                    break;
                case "Enter":
                    e.preventDefault();
                    navigate({
                        pathname: "/notes",
                        search: `?id=${results[selectedIndex]._id}`
                    })
                    closeSearch();
                    break;
            }
        }

        window.addEventListener("keydown", Overrides);
        return () => {
            window.removeEventListener("keydown", Overrides);
        }
    }, [results, selectedIndex, isOpen])


    return (
        <div className={`${isOpen ? "opacity-100" : "pointer-events-none opacity-0"} transition fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
            <div className="w-11/12 lg:w-5/6 h-[80vh] max-h-[90vh] overflow-auto rounded-lg shadow-xl relative flex gap-4">
                <div className="flex flex-col gap-4 w-1/2">
                    <SearchResults
                        closeSearch={closeSearch}
                        notes={results}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex} />
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery} />
                </div>
                <NotePreview noteId={(results.length > 0 && results[selectedIndex]) ? results[selectedIndex]._id : null} />
            </div>
        </div>
    )
}


