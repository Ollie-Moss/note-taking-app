import React, { useRef, useState } from "react";
import { Note } from "../models/note";
import { Delta, EmitterSource, Module, QuillOptions } from "quill";
import ReactQuill from 'react-quill-new';
import { useDispatch } from "react-redux";
import { updateNoteAsync } from "../slices/noteSlice";
import { AppDispatch } from "../store";
import { useToast } from "../lib/toastProvider";
import PlainTextPasteHandler from "../lib/plaintextPaste";
import { ToolbarConfig } from "quill/modules/toolbar";

// Editor for a given note
export default function Editor({ note: initialNote }: { note: Note }) {
    const titleRef = useRef<HTMLHeadingElement>(null);

    // helpers
    const { createNotification } = useToast()
    const dispatch: AppDispatch = useDispatch()

    // debounced autosave settings
    const autoSaveDelay = 2000;
    const autoSaveTimeoutRef = useRef<{ [key: string]: number }>({});

    const [delta, setDelta] = useState<Delta>(JSON.parse(initialNote.contents))
    const [title, setTitle] = useState<string>(initialNote.title)

    function UpdateNote() {
        // Cancel current autosave
        clearTimeout(autoSaveTimeoutRef.current[initialNote._id]);

        const updatedNote: Partial<Note> = { _id: initialNote._id, title, contents: JSON.stringify(delta) };

        // Queue update request
        autoSaveTimeoutRef.current[initialNote._id] = setTimeout(() => {
            dispatch(updateNoteAsync({ id: updatedNote._id, note: updatedNote }))
            createNotification({ message: "Note Updated!", type: "success" })
        }, autoSaveDelay);
    }

    // updates note if content changes
    function SetDelta(_value: string, _delta: Delta, _source: EmitterSource, editor: ReactQuill.UnprivilegedEditor): void {
        const newDelta: Delta = editor.getContents();
        if (JSON.stringify(newDelta) != JSON.stringify(delta)) {
            setDelta(newDelta)
            UpdateNote()
        }
    }

    // updates note if title changes
    function SetTitle(e: React.FormEvent<HTMLInputElement>): void {
        const newTitle = e.currentTarget.value ?? "";
        if (newTitle != title) {
            setTitle(newTitle)
            // stops newline from appearing when empty
            if (newTitle == "") {
                titleRef.current.innerText = ""
            }
            UpdateNote()
        }
    }

    // Creates untitled note placeholder when title field is empty
    return (
        <div className="px-12 pt-10 lg:px-24 text-white">
            <input className={`text-white text-lg outline-none bg-bg focus:bg-bg-dark rounded-lg px-2 py-1`}
                placeholder="Untitled Note..."
                value={title}
                onInput={SetTitle}
                onPaste={PlainTextPasteHandler} />
            <ReactQuill
                onChange={SetDelta}
                className="text-white"
                placeholder="Start your note here..."
                value={delta}
                theme="bubble" />
        </div>
    )
}
