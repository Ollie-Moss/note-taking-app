import { useEffect, useRef, useState } from "react";
import { Note } from "../models/note";
import { UpdateNote } from "../controllers/noteController";
import { Delta, EmitterSource } from "quill";
import ReactQuill from "react-quill-new";
import { useQueryClient } from "@tanstack/react-query";

export default function Editor({ note }: { note: Note }) {
    const autoSaveDelay = 2000;
    const queryClient = useQueryClient()

    const editorRef = useRef<ReactQuill>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    const [delta, setDelta] = useState<Delta>(JSON.parse(note.contents));
    const [title, setTitle] = useState<string>(note.title);

    const autoSaveTimeoutRef = useRef<number>(null);

    async function SaveNote(updatedNote: Note): Promise<void> {
        if(updatedNote._id != note._id) return;

        console.log("Saving Note: ", updatedNote)

        try {
            await UpdateNote(updatedNote);
        } catch (error) {
            console.log(error)
        }
    };

    function HandleNoteChange(noteId: string) {
        if(noteId != note._id) return;
        const updatedNote: Note = {
            ...note,
            title: title,
            contents: JSON.stringify(delta, null, 2)
        }
        //queryClient.setQueryData(["notes"],
        //    (prev: Note[]) => prev?.map((note: Note) => note._id == updatedNote._id ? updatedNote : note));

        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        autoSaveTimeoutRef.current = setTimeout(() => {
            SaveNote(updatedNote);
        }, autoSaveDelay);
    }

    useEffect(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current)
        }
    }, [note._id])

    function SetDelta(_value: string, _delta: Delta, _source: EmitterSource, editor: ReactQuill.UnprivilegedEditor): void {
        const newDelta: Delta = editor.getContents(); 
        if(delta != newDelta){
            HandleNoteChange(note._id)
        }
        setDelta(newDelta)
    }

    function SetTitle(e: React.FormEvent<HTMLHeadingElement>): void {
        const newTitle = e.currentTarget.textContent ?? "";
        if(title != newTitle){
            HandleNoteChange(note._id)
        }
        setTitle(newTitle)
    }

    // Ensures only plain text can be pasted
    function HandlePaste(e: React.ClipboardEvent<HTMLHeadingElement>): void {
        e.preventDefault();

        const text = e.clipboardData?.getData('text/plain');
        const selectedRange = window.getSelection()?.getRangeAt(0);
        if (!selectedRange || !text) {
            return;
        }

        selectedRange.deleteContents();
        selectedRange.insertNode(document.createTextNode(text));
        selectedRange.setStart(selectedRange.endContainer, selectedRange.endOffset);

        // Trigger change event to ensure that state is updated
        const changeEvent: Event = new Event('input', { bubbles: true });
        e.currentTarget.dispatchEvent(changeEvent);
    }

    useEffect(() => {
        editorRef.current?.editor?.setContents(JSON.parse(note.contents));
        if (titleRef.current) {
            titleRef.current.textContent = note.title;
        }
    }, [note])

    return (
        <div className="px-24 pt-10">
            <h1 className="text-white text-lg outline-none focus:bg-bg-dark rounded-lg px-2 py-1"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={SetTitle}
                onPaste={HandlePaste}
                ref={titleRef}
            >{note.title}</h1>
            <ReactQuill
                ref={editorRef}
                onChange={SetDelta}
                className="text-white"
                placeholder=""
                key={note.contents}
                theme="bubble">
                <div className="[&>*]:outline-none [&>*:focus]:bg-bg-dark [&>*]:rounded-lg" />
            </ReactQuill>
        </div>
    )
}
