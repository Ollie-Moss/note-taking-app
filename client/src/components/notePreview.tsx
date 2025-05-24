import { useEffect, useMemo, useRef } from "react"
import ReactQuill from "react-quill-new"
import { useDispatch, useSelector } from "react-redux"
import { noteMapSelector } from "../selectors/noteSelectors"
import { fetchNoteAsync } from "../slices/noteSlice"
import { AppDispatch } from "../store"

// Kinda useless but does the same thing as the editor but without the editing
// Displays a note (its title and content)
// Fetches content from server
export default function NotePreview({ noteId }: { noteId: string | null }) {
    const editorRef = useRef<ReactQuill>(null)

    const notes = useSelector(noteMapSelector)
    const note = useMemo(() => notes[noteId], [notes, noteId])

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        if (!note) return
        dispatch(fetchNoteAsync(noteId))
    }, [noteId])

    useEffect(() => {
        editorRef.current?.editor?.setContents(JSON.parse(note.contents ?? "{}"));
    }, [note])

    const untitledNoteStyle = "after:inline after:font-light after:opacity-[0.6] after:italic after:content-['Untitled_Note...']"
    return (
        <div className="bg-bg p-4 w-1/2 rounded-lg break-words overflow-y-scroll">
            {note ?
                <>
                    <h1 className={`text-white text-lg outline-none focus:bg-bg-dark rounded-lg px-2 py-1
                            ${note.title == "" ? untitledNoteStyle : ""} `}>{note.title}</h1>
                    <ReactQuill
                        ref={editorRef}
                        className="text-white"
                        readOnly={true}
                        key={note.contents}
                        theme="bubble">
                        <div className="[&>*]:outline-none [&>*]:rounded-lg" />
                    </ReactQuill>
                </>
                :
                <h1 className="text-white text-md px-2 py-1 after:inline opacity-[0.6] italic ">No Content</h1>
            }
        </div>
    )
}
