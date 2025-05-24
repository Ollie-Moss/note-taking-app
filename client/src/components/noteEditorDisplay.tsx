import useNoteAsync from "../hooks/useNoteAsync"
import Editor from "./editor"
import LoadingSpinner from "./spinner"

export default function NoteEditorDisplay({ noteId }: { noteId: string }) {
    const { loading, note } = useNoteAsync(noteId)

    return (
        <div className="h-full w-full bg-bg">
            {noteId == "" || loading || !note ?
                <div className="px-12 pt-10 lg:px-24">
                    <LoadingSpinner />
                </div>
                :
                <Editor note={note} />
            }
        </div >
    )
}
