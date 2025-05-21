import React, { useEffect, useRef, useState } from "react";
import { Note } from "../models/note";
import { Delta, EmitterSource } from "quill";
import ReactQuill from "react-quill-new";
import { useDispatch } from "react-redux";
import { updateNoteAsync } from "../reducers/noteReducer";
import { AppDispatch } from "../store";
import { useToast } from "../lib/toastProvider";
import PlainTextPasteHandler from "../lib/plaintextPaste";

export default function Editor({ note: initialNote }: { note: Note }) {
    const editorRef = useRef<ReactQuill>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const shouldUpdate = useRef<boolean>(false)

    const lastUpdates = useRef<Partial<Note>>({})

    const { createNotification } = useToast()
    const dispatch: AppDispatch = useDispatch()

    const autoSaveDelay = 2000;
    const autoSaveTimeoutRef = useRef<number>(null);

    const [hasTitle, setHasTitle] = useState<boolean>(false)

    function UpdateNote(updates: Partial<Note>) {
        if (!shouldUpdate.current) return

        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        const fullUpdate = { ...lastUpdates.current, ...updates };
        dispatch(updateNoteAsync.pending("manual-" + Date.now(), { id: initialNote._id, note: fullUpdate }))
        lastUpdates.current = fullUpdate;

        autoSaveTimeoutRef.current = setTimeout(() => {
            dispatch(updateNoteAsync({ id: initialNote._id, note: fullUpdate }))
            createNotification({ message: "Note Updated!", type: "success" })
        }, autoSaveDelay);
    }


    useEffect(() => {
        shouldUpdate.current = false
        lastUpdates.current = {};
        // manually update as quill has some weird quirks
        if (initialNote.contents) {
            editorRef.current?.editor?.setContents(JSON.parse(initialNote.contents));
        }
        titleRef.current.textContent = initialNote.title
        setHasTitle(initialNote.title != "");
        shouldUpdate.current = true
    }, [initialNote])

    function SetDelta(_value: string, _delta: Delta, _source: EmitterSource, editor: ReactQuill.UnprivilegedEditor): void {
        const newDelta: Delta = editor.getContents();
        UpdateNote({ contents: JSON.stringify(newDelta) })
    }

    function SetTitle(e: React.FormEvent<HTMLHeadingElement>): void {
        const newTitle = e.currentTarget.textContent ?? "";
        setHasTitle(newTitle != "");
        // stops newline from appearing when empty
        if(newTitle == ""){
            titleRef.current.innerText = ""
        }
        UpdateNote({ title: newTitle })
    }


    const untitledNoteStyle = "after:inline after:font-light after:opacity-[0.6] after:italic after:content-['Untitled_Note...']"

    return (
        initialNote ?
            <div className="px-12 pt-10 lg:px-24">
                <h1 className={`text-white text-lg outline-none focus:bg-bg-dark rounded-lg px-2 py-1
                            ${!hasTitle && untitledNoteStyle}`}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onInput={SetTitle}
                    onPaste={PlainTextPasteHandler}
                    ref={titleRef}
                >{initialNote.title}</h1>
                <ReactQuill
                    ref={editorRef}
                    onChange={SetDelta}
                    className="text-white"
                    placeholder="Start your note here..."
                    key={initialNote.contents}
                    theme="bubble">
                    <div className="[&>*]:outline-none [&>*:focus]:bg-bg-dark [&>*]:rounded-lg" />
                </ReactQuill>
            </div>
            : <></>
    )
}
