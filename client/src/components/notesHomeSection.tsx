import { useNotes } from "../lib/noteContext"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile } from "@fortawesome/free-solid-svg-icons"
import { Note } from "../models/note"

export default function NotesHomeSection() {
    const { notes, createNote } = useNotes()

    return (
        <div className="flex justify-center h-full w-full lg:w-[calc(100%-220px)] bg-bg">
            <div className="items-center flex flex-col gap-6 py-32 w-[40%]">
                <h1 className="text-[40px] text-white font-semibold">Welcome Back, Ollie!</h1>
                <button onClick={createNote} className="px-3 py-2 bg-white font-bold text-bg-dark rounded-lg shadow-md hover:bg-gray-400 transition">Create a New Note</button>
                <br/>
                <NotesSection title={"Recently Edited"} notes={notes.sort((a, b) => b.editedAt.getTime() - a.editedAt.getTime())} />
                <NotesSection title={"Favourites"} notes={notes.filter(note => note.favourite)} />
            </div>
        </div>
    )
}

function NotesSection({ title, notes }: { title: string, notes: Note[] }) {
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
                        <Link
                            className="min-w-[200px] w-[200px]"
                            key={note._id}
                            to={{
                                pathname: "/notes",
                                search: `?id=${note._id}`
                            }}>
                            <li
                                className="p-4 overflow-hidden flex gap-2 items-center bg-bg rounded-lg hover:bg-bg-light transition" >
                                <FontAwesomeIcon className="size-[32px] text-white" icon={faFile} />
                                {note.title == "" ?
                                    <h3 className="opacity-[0.6] italic text-nowrap overflow-hidden text-ellipsis text-base font-medium">Untitled Note</h3>
                                    :
                                    <h3 className="text-nowrap overflow-hidden text-ellipsis text-base font-medium">{note.title}</h3>
                                }
                            </li>
                        </Link>
                    ))
                    :
                    <h3 className="italic text-base font-medium">No notes here...</h3>
                }
            </ul>
        </section>
    )
}
