import React, { useEffect, useRef, useState } from "react";
import { Note } from "../models/note";
import { Delta, EmitterSource } from "quill";
import ReactQuill from "react-quill-new";
import { useDispatch } from "react-redux";
import { updateNoteAsync } from "../reducers/noteReducer";
import { AppDispatch } from "../store";
import { useToast } from "../lib/toastProvider";

export default function Editor({ note: initialNote }: { note: Note }) {
    const editorRef = useRef<ReactQuill>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const shouldUpdate = useRef<boolean>(false)

    const { createNotification } = useToast()
    const dispatch: AppDispatch = useDispatch()

    const autoSaveDelay = 2000;
    const autoSaveTimeoutRef = useRef<number>(null);

    const [delta, setDelta] = useState<Delta>(JSON.parse(initialNote ? initialNote.contents ?? "{}" : "{}"));
    const [title, setTitle] = useState<string>(initialNote ? initialNote.title ?? "" : "");

    function UpdateNote(newTitle: string, newDelta: Delta) {
        const updates: { id: string, note: Partial<Note> } =
            { id: initialNote._id, note: { contents: JSON.stringify(newDelta, null, 2), title: newTitle } }

        if (!shouldUpdate.current) return
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }
        dispatch(updateNoteAsync.pending("manual-" + Date.now(), updates))

        autoSaveTimeoutRef.current = setTimeout(() => {
            dispatch(updateNoteAsync(updates))
            createNotification({ message: "Note Updated!", type: "success" })
        }, autoSaveDelay);
    }


    useEffect(() => {
        shouldUpdate.current = false
        // manually update as quill has some weird quirks
        if (initialNote.contents) {
            editorRef.current?.editor?.setContents(JSON.parse(initialNote.contents));
        }
        setTitle(initialNote.title);
        shouldUpdate.current = true
    }, [initialNote])

    function SetDelta(_value: string, _delta: Delta, _source: EmitterSource, editor: ReactQuill.UnprivilegedEditor): void {
        const newDelta: Delta = editor.getContents();
        setDelta(newDelta)
        UpdateNote(title, newDelta)
    }

    function SetTitle(e: React.FormEvent<HTMLHeadingElement>): void {
        const newTitle = e.currentTarget.textContent ?? "";
        setTitle(newTitle)
        UpdateNote(newTitle, delta)
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

    const untitledNoteStyle = "after:inline after:font-light after:opacity-[0.6] after:italic after:content-['Untitled_Note...']"

    return (
        initialNote ?
            <div className="px-24 pt-10">
                <h1 className={`text-white text-lg outline-none focus:bg-bg-dark rounded-lg px-2 py-1
                            ${title == "" ? untitledNoteStyle : ""} `}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onInput={SetTitle}
                    onPaste={HandlePaste}
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
