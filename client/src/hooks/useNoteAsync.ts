import { useDispatch, useSelector } from "react-redux";
import { fetchNoteAsync } from "../slices/noteSlice";
import { noteMapSelector } from "../selectors/noteSelectors";
import { useEffect, useRef, useState } from "react";
import { AppDispatch } from "../store";
import { Note } from "../models/note";

// Dispatches a fetch to backend for a given note 
// Will only provide a full note (requires content)
// Will only provide state updates if the id changes
export default function useNoteAsync(noteId: string) {
    const notes = useSelector(noteMapSelector)
    const [note, setNote] = useState<Note | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const noteIdRef = useRef(null);

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        // If noteId has not changed dont worry about changes
        if (noteIdRef.current == noteId) return

        // if no content is found set loading and clear current note
        if (notes[noteId] && !notes[noteId].hasOwnProperty("contents")) {
            setLoading(true)
            setNote(null)
            dispatch(fetchNoteAsync(noteId))
            return
        }
        // if no note is found return
        if (!notes[noteId]) return setNote(null)

        // only update if note is found with content
        // only update current noteid if note has been updated with full content
        noteIdRef.current = noteId
        setNote(notes[noteId])
        setLoading(false)

    }, [noteId, notes])

    return { loading, note }
}
