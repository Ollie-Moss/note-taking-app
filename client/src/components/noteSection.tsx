import { Note } from "../models/note";
import { NoteCard } from "./noteCard";

// Renders a horizontally scrollable list of NoteCards
// Displays a title for the section
// Uses an override to enable horizontal scrolling with scroll whell
// Displays message if no notes are found
// Uses a non-draggable NoteCard component to display notes
export default function NotesSection({ title, notes }: { title: string, notes: (Note | Partial<Note>)[] }) {

    // Switches scroll wheel to navigate horizontally
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
                    /* Uses non-draggable note card */
                    notes.map((note) => (
                        <NoteCard
                            key={note._id}
                            className="bg-bg min-w-[200px] w-[200px] p-4"
                            noteId={note._id} />
                    ))
                    :
                    // Fallback if there are no notes to display
                    <h3 className="italic text-base font-medium">No notes here...</h3>
                }
            </ul>
        </section>
    )
}
