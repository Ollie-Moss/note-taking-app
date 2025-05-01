import { useLocation } from "react-router";
import Sidebar from "../../components/sidebar";
import { useEffect, useMemo, useState } from "react";
import { Note } from "../../models/note";
import { GetNote } from "../../controllers/noteController";
import Editor from "../../components/Editor";


export default function Notes() {
    return (
        <div className="w-full h-full flex">
            <Sidebar />
            <NoteDisplay />
        </div>
    )
}

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function NoteDisplay() {
    const query: URLSearchParams = useQuery();
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        const noteId = query.get("id")
        if (!noteId) return setNote(null);
        GetNote(noteId).then((note: Note) => {
            setNote(note);
        })
    }, [query])


    return (
        <div className="h-full w-full bg-bg">
            {note ?
                <Editor note={note} />
                :
                <></>
            }
        </div >
    )
}

