import { useNotes } from "../lib/noteContext"

export default function NotesHomeSection() {
    const { notes } = useNotes()

    return (
        <div className="h-full w-full bg-bg">
            <div className="p-6 space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Recently Edited</h2>
                    <ul className="space-y-3">
                        {notes.map((note) => (
                            <li
                                key={note._id}
                                className="p-4 border border-gray-200 rounded hover:shadow transition"
                            >
                                <h3 className="text-lg font-medium">{note.title}</h3>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Favorites</h2>
                    <ul className="space-y-3">
                        {notes.map((note) => (
                            <li
                                key={note._id}
                                className="p-4 border border-yellow-200 bg-yellow-50 rounded hover:shadow transition" >
                                <h3 className="text-lg font-medium">{note.title}</h3>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    )
}
