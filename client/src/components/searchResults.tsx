import { useNavigate } from "react-router";
import { NoteCard } from "./noteCard";
import { Note } from "../models/note";

// Displays a list of notes 
// Highlights selected note
// Clicking a note selects it or navigates to it if already selected
export default function SearchResults({ closeSearch, notes, selectedIndex, setSelectedIndex }:
    {
        closeSearch: () => void,
        notes: Note[],
        selectedIndex: number,
        setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
    }) {
    const navigate = useNavigate();

    // Handles click on a note in the results
    // Navigates if the note is already selected, otherwise sets selection
    function resultClicked(index: number) {
        if (selectedIndex == index) {
            navigate({
                pathname: "/notes",
                search: `id=${notes[index]._id}`
            })
            closeSearch();
        }
        setSelectedIndex(index)

    }

    return (
        <div className="h-full bg-bg p-4 rounded-lg flex flex-col gap-2 justify-end">
            {notes.map((note, i) =>
                <NoteCard
                    className={i == selectedIndex ? "bg-bg-dark" : "bg-bg"}
                    onClick={() => resultClicked(i)}
                    key={i}
                    noteId={note._id} draggable={false} />
            ).reverse() // Show most relevant at bottom 
            }
        </div>
    )
}

