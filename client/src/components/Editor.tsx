import { useEffect, useState } from "react";
import { Note } from "../models/note";
import { UpdateNote } from "../controllers/noteController";
import { Delta, EmitterSource } from "quill";
import ReactQuill from "react-quill-new";

export default function Editor({ note }: { note: Note }) {
    // minutes
    const autoSaveInterval = 1;

    const [autoSave, setAutoSave] = useState<boolean>(false);

    const [delta, setDelta] = useState<Delta>(JSON.parse(note.contents));
    const [title, setTitle] = useState<string>(note.title);

    useEffect(() => {
        // autosave
        const saveNote = setInterval(function() {
            setAutoSave(true);
        }, autoSaveInterval * 60 * 1000);

        // Cleanup save interval
        return () => {
            clearInterval(saveNote);
        }
    }, []);

    useEffect(() => {
        if (autoSave) {
            SaveNote();
            setAutoSave(false);
        }
    }, [autoSave, note, title, delta, SaveNote])

    async function SaveNote(): Promise<void> {
        const updatedNote: Note = {
            ...note,
            title: title,
            contents: JSON.stringify(delta, null, 2)
        }
        console.log("Saving Note: ", updatedNote)

        try {
            await UpdateNote(updatedNote);
        } catch (error) {
            console.log(error)
        }
    };

    function SetDelta(_value: string, _delta: Delta, _source: EmitterSource, editor: ReactQuill.UnprivilegedEditor): void {
        const editorDelta: Delta = editor.getContents();
        setDelta(editorDelta);
    }

    function SetTitle(e: React.FormEvent<HTMLHeadingElement>): void {
        setTitle(e.currentTarget.textContent ?? "");
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

    return (
        <div className="px-24 pt-10">
            <button onClick={SaveNote} >Save</button>
            <h1 className="text-white text-lg"
                contentEditable={true}
                suppressContentEditableWarning={true}
                onInput={SetTitle}
                onPaste={HandlePaste}
            >{note.title}</h1>
            <ReactQuill
                onChange={SetDelta}
                className="text-white"
                defaultValue={delta}
                theme="bubble" />
        </div>
    )
}
