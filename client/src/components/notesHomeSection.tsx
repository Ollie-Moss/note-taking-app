import { useNotes } from "../lib/noteProvider"
import { useSearch } from "../lib/searchProvider"
import { Note, NotePreview } from "../models/note"
import { NoteDisplay } from "./noteDisplay"

export default function NotesHomeSection() {
    const { notes, createNote } = useNotes()
    const { OpenSearch } = useSearch()

    return (
        <div className="flex justify-center h-full w-full">
            <div className="items-center flex flex-col gap-6 py-32 w-[70%] lg:w-[40%]">
                <h1 className="text-center text-[40px] text-white font-semibold">Welcome Back, Ollie!</h1>
                <div className="flex justify-center items-center gap-4">
                    <button onClick={OpenSearch} className="w-28 px-3 py-2 bg-white font-bold text-bg-dark rounded-lg shadow-md hover:bg-gray-400 transition">Search</button>
                    <button onClick={createNote} className="w-28 px-3 py-2 bg-white font-bold text-bg-dark rounded-lg shadow-md hover:bg-gray-400 transition">New Note</button>
                </div>
                <NotesSection title={"Recently Edited"} notes={notes.sort((a, b) => b.editedAt.getTime() - a.editedAt.getTime())} />
                <NotesSection title={"Favourites"} notes={notes.filter(note => note.favourite)} />
            </div>
        </div>
    )
}

function NotesSection({ title, notes }: { title: string, notes: (Note | NotePreview)[] }) {
    function ScrollOverride(e: React.WheelEvent<HTMLUListElement>) {
        if (e.deltaY !== 0) {
            e.currentTarget.scrollLeft += e.deltaY / 10;
        }
    }
    return (
        <section className="p-4 w-full overflow-hidden text-white bg-bg-dark rounded-lg">
            <h2 className="text-md font-semibold mb-4">{title}</h2>
            <ul onWheel={ScrollOverride} className="flex gap-4 overflow-scroll">
                {notes.length > 0 ?
                    notes.map((note) => (
                        <NoteDisplay
                            key={note._id}
                            className="bg-bg min-w-[200px] w-[200px] p-4"
                            noteId={note._id} />
                    ))
                    :
                    <h3 className="italic text-base font-medium">No notes here...</h3>
                }
            </ul>
        </section>
    )
}
