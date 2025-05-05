import Sidebar from "../../components/sidebar";
import { useEffect, useState } from "react";
import { Note } from "../../models/note";
import { GetNote } from "../../controllers/noteController";
import Editor from "../../components/editor";
import { useQuery } from "../../lib/useQuery";
import Search from "../../components/search";


export default function Notes() {
    return (
        <>
            <Search />
            <div className="w-full h-full flex">
                <Sidebar />
                <NoteDisplay />
            </div>
        </>
    )
}


function NoteDisplay() {
    const query: URLSearchParams = useQuery();
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        const noteId = query.get("id")
        if (!noteId) return setNote(null);
        GetNote(noteId).then((note: Note | null) => {
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

