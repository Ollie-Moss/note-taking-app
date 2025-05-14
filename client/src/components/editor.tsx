import React, { useEffect, useRef, useState } from "react";
import { Note } from "../models/note";
import { Delta, EmitterSource } from "quill";
import ReactQuill from "react-quill-new";
import { useNoteFromServer } from "../lib/noteProvider";

export default function Editor({ noteId }: { noteId: string }) {
    const editorRef = useRef<ReactQuill>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const shouldUpdate = useRef<boolean>(false);

    const { note, updateNote } = useNoteFromServer(noteId)

    const [delta, setDelta] = useState<Delta>(JSON.parse(note ? note.contents ?? "{}" : "{}"));
    const [title, setTitle] = useState<string>(note ? note.title ?? "" : "");

    function updateNoteOnServer() {
        if (!shouldUpdate.current) return;
        const updatedNote: Partial<Note> = {
            ...note,
            title: title,
            contents: JSON.stringify(delta, null, 2)
        }
        updateNote(note._id, updatedNote, true);
    }

    useEffect(() => {
        if (!note) return
        shouldUpdate.current = false;
        // manually update as quill has some weird quirks
        editorRef.current?.editor?.setContents(JSON.parse(note ? note.contents ?? "{}" : "{}"));
        setTitle(note ? note.title ?? "" : "");
        setDelta(JSON.parse(note ? note.contents ?? "{}" : "{}"));
        shouldUpdate.current = true;

    }, [noteId, note])

    function SetDelta(_value: string, _delta: Delta, _source: EmitterSource, editor: ReactQuill.UnprivilegedEditor): void {
        const newDelta: Delta = editor.getContents();
        setDelta(newDelta)
        updateNoteOnServer()
    }

    function SetTitle(e: React.FormEvent<HTMLHeadingElement>): void {
        const newTitle = e.currentTarget.textContent ?? "";
        if (e.currentTarget.textContent == "") {
            e.currentTarget.innerText = ""
        }
        setTitle(newTitle)
        updateNoteOnServer()
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
        note ?
            <div className="px-24 pt-10">
                <h1 className={`text-white text-lg outline-none focus:bg-bg-dark rounded-lg px-2 py-1
                            ${title == "" ? untitledNoteStyle : ""} `}
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
                    placeholder="Start your note here..."
                    key={note.contents}
                    theme="bubble">
                    <div className="[&>*]:outline-none [&>*:focus]:bg-bg-dark [&>*]:rounded-lg" />
                </ReactQuill>
            </div>
            : <></>
    )
}
