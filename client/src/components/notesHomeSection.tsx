import { useDispatch, useSelector } from "react-redux"
import { useSearch } from "../lib/searchProvider"
import { createNoteAsync } from "../slices/noteSlice"
import { noteArraySelector } from "../selectors/noteSelectors"
import { AppDispatch } from "../store"
import NotesSection from "./noteSection"

export default function NotesHomeSection() {
    const notes = useSelector(noteArraySelector)
    const { OpenSearch } = useSearch()
    const dispatch: AppDispatch = useDispatch()

    return (
        <div className="flex justify-center h-full w-full">
            <div className="items-center flex flex-col gap-6 py-20 w-[70%] lg:w-[60%]">
                {/* Welcome Message */}
                <h1 className="text-center text-[40px] text-white font-semibold">Welcome Back, Ollie!</h1>
                {/* Quick Links */}
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={OpenSearch}
                        className="w-28 px-3 py-2 bg-white font-bold text-bg-dark rounded-lg shadow-md hover:bg-gray-400 transition">Search</button>
                    <button
                        onClick={() => dispatch(createNoteAsync())}
                        className="w-28 px-3 py-2 bg-white font-bold text-bg-dark rounded-lg shadow-md hover:bg-gray-400 transition">New Note</button>
                </div>
                {/* Recently Editied and Favourites */}
                <NotesSection
                    title={"Recently Edited"}
                    notes={notes.sort((a, b) => b.editedAt.getTime() - a.editedAt.getTime())} />
                <NotesSection
                    title={"Favourites"}
                    notes={notes.filter(note => note.favourite)} />
            </div>
        </div>
    )
}

