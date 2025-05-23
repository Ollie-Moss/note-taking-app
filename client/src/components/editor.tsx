import React, { useEffect, useRef, useState } from "react";
import { Note } from "../models/note";
import { Delta, EmitterSource } from "quill";
import ReactQuill from "react-quill-new";
import { useDispatch } from "react-redux";
import { updateNoteAsync } from "../slices/noteSlice";
import { AppDispatch } from "../store";
import { useToast } from "../lib/toastProvider";
import PlainTextPasteHandler from "../lib/plaintextPaste";

export default function Editor({ note: initialNote }: { note: Note }) {
    const editorRef = useRef<ReactQuill>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const shouldUpdate = useRef<boolean>(false)

    // keeps track of that last updates queued in an auto save
    const lastUpdates = useRef<Partial<Note>>({})

    // helpers
    const { createNotification } = useToast()
    const dispatch: AppDispatch = useDispatch()

    // debounced autosave settings
    const autoSaveDelay = 2000;
    const autoSaveTimeoutRef = useRef<{ [key: string]: number }>({});

    // used to display placeholder in title input
    const [hasTitle, setHasTitle] = useState<boolean>(false)

    const [delta, setDelta] = useState<Delta>(JSON.parse(initialNote.contents))
    const [title, setTitle] = useState<string>(initialNote.title)

    function UpdateNote() {
        if (!shouldUpdate.current) return

        // Cancel current autosave
        clearTimeout(autoSaveTimeoutRef.current[initialNote._id]);

        const updatedNote: Partial<Note> = { title, contents: JSON.stringify(delta) };
        dispatch(updateNoteAsync.pending("manual-" + Date.now(), {
            id: initialNote._id,
            note: updatedNote
        }))
        lastUpdates.current = updatedNote;

        // Queue update request
        autoSaveTimeoutRef.current[initialNote._id] = setTimeout(() => {
            dispatch(updateNoteAsync({ id: initialNote._id, note: updatedNote }))
            createNotification({ message: "Note Updated!", type: "success" })
        }, autoSaveDelay);
    }

    // Manually updates the input fields as quill does
    // not like being updated when 
    useEffect(() => {
        shouldUpdate.current = false
        lastUpdates.current = {};
        // manually update as quill has some weird quirks
        if (initialNote.contents) {
            //editorRef.current?.editor?.setContents(JSON.parse(initialNote.contents));
            setDelta(JSON.parse(initialNote.contents));
        }
        //titleRef.current.textContent = initialNote.title
        setTitle(initialNote.title);
        setHasTitle(initialNote.title != "");
        shouldUpdate.current = true
    }, [initialNote])

    function SetDelta(_value: string, _delta: Delta, _source: EmitterSource, editor: ReactQuill.UnprivilegedEditor): void {
        const newDelta: Delta = editor.getContents();
        if (JSON.stringify(newDelta) != JSON.stringify(delta)) {
            setDelta(newDelta)
            UpdateNote()
        }
    }

    function SetTitle(e: React.FormEvent<HTMLHeadingElement>): void {
        const newTitle = e.currentTarget.textContent ?? "";
        if (newTitle != title) {
            setHasTitle(newTitle != "");
            setTitle(newTitle)
            // stops newline from appearing when empty
            if (newTitle == "") {
                titleRef.current.innerText = ""
            }
            UpdateNote()
        }

    }


    // Creates untitled note placeholder when title field is empty
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
                >{title}</h1>
                <ReactQuill
                    ref={editorRef}
                    onChange={SetDelta}
                    className="text-white"
                    placeholder="Start your note here..."
                    value={delta}
                    key={initialNote.contents}
                    theme="bubble">
                    <div className="[&>*]:outline-none [&>*:focus]:bg-bg-dark [&>*]:rounded-lg" />
                </ReactQuill>
            </div>
            : <></>
    )
}
