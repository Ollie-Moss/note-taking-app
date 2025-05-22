import { useNavigate } from "react-router";
import { NoteCard } from "./noteCard";
import { Note } from "../models/note";

// List of notes highlighting the selected one
export default function SearchResults({ closeSearch, notes, selectedIndex, setSelectedIndex }:
    {
        closeSearch: () => void, notes: Note[],
        selectedIndex: number, setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
    }) {
    const navigate = useNavigate();
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
            ).reverse()}
        </div>
    )
}

