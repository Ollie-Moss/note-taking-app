import { useLocation } from "react-router";
import Sidebar from "../../components/sidebar";
import { useEffect, useMemo, useState } from "react";
import { Note } from "../../models/note";
import { GetNote } from "../../controllers/noteController";
import { useRef } from 'react';
import Quill, { Delta } from "quill";
import ReactQuill from "react-quill-new";


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
    const noteId = query.get("id")
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        if (!noteId) return;
        GetNote(noteId).then((note: Note) => {
            setNote(note);
        })
    }, [])


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

function Editor({ note }: { note: Note }) {
    const editor = useRef<ReactQuill | null>(null);
    const [delta, setDelta] = useState<Delta>();

    const SetDelta: () => void = () => {
        if (!editor.current) return;
        const quill: Quill = editor.current.getEditor();
        const delta: Delta = quill.getContents();
        setDelta(delta);
        console.log(JSON.stringify(delta, null, 2));
    }

    return (
        <div className="px-24 pt-10">
            <h1 className="text-white text-lg"
                contentEditable={true}
                suppressContentEditableWarning={true}
                >{note.title}</h1>
            <ReactQuill
                ref={editor}
                onChange={SetDelta}
                className="text-white"
                defaultValue={JSON.parse(note.contents)}
                theme="bubble" />
        </div>
    )
}
