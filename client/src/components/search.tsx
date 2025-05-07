import { SetStateAction, useEffect, useReducer, useRef, useState } from "react";
import { useQueryParams } from "../lib/useQueryParams";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { Note } from "../models/note";
import ReactQuill from "react-quill-new";
import Fuse from "fuse.js"
import { useNavigate } from "react-router";
import useNotes from "../lib/useNotes";

export default function Search({ closeSearch }: { closeSearch: () => void }) {
    const navigate = useNavigate();

    const { notes, isPending, error } = useNotes();

    const [results, setResults] = useState<Note[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const fuse = new Fuse(notes, {
            keys: ['title'],
            threshold: 0.3 // Lower = stricter match
        });

        if (searchQuery === "") return setResults(notes);
        setResults(fuse.search(searchQuery).map(result => result.item));

    }, [notes?.length, searchQuery])

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


    useEffect(() => {
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
    }, [results, selectedIndex])


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 lg:w-4/6 h-[80vh] max-h-[90vh] overflow-auto rounded-lg shadow-xl relative flex gap-4">
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
                <SearchPreview note={results[selectedIndex]} />
            </div>
        </div>
    )
}

function SearchPreview({ note }: { note: Note }) {
    const editorRef = useRef<ReactQuill>(null)

    useEffect(() => {
        editorRef.current?.editor?.setContents(JSON.parse(note.contents));
    }, [note])

    return (
        <div className="bg-bg p-4 w-1/2 rounded-lg break-words overflow-y-scroll">
            {note ?
                <>
                    <h1 className="text-white text-lg rounded-lg px-2 py-1"> {note.title}
                    </h1>
                    <ReactQuill
                        ref={editorRef}
                        className="text-white"
                        readOnly={true}
                        key={note.contents}
                        theme="bubble">
                        <div className="[&>*]:outline-none [&>*]:rounded-lg" />
                    </ReactQuill>
                </>
                : <p>No Contents</p>
            }
        </div>
    )
}

function SearchResults({ closeSearch, notes, selectedIndex, setSelectedIndex }: { closeSearch: () => void, notes: Note[], selectedIndex: number, setSelectedIndex: React.Dispatch<React.SetStateAction<number>> }) {
    const navigate = useNavigate();
    function resultClicked(index: number) {
        if (selectedIndex == index) {
            navigate({
                pathname: "/notes",
                search: notes[index]._id
            })
            closeSearch();
        }
        setSelectedIndex(index)

    }

    return (
        <div className="h-full bg-bg p-4 rounded-lg flex flex-col gap-2 justify-end">
            {notes.map((note, i) =>
                <div
                    key={i}
                    onClick={() => resultClicked(i)}
                    className={`select-none hover:cursor-pointer flex items-center gap-2 p-3 rounded-lg text-white ${i === selectedIndex ? "bg-bg-dark" : ""}`}>
                    <FontAwesomeIcon icon={faFile} />
                    {note.title == "" ?
                        <p className="text-sm text-white opacity-[0.6] italic">Untitled Note</p>
                        :
                        <p className="text-sm text-white">{note.title}</p>
                    }
                </div>
            ).reverse()}
        </div>
    )
}

function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: React.Dispatch<SetStateAction<string>> }) {
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
