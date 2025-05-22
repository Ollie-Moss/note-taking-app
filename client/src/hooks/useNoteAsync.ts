import { useDispatch, useSelector } from "react-redux";
import { fetchNoteAsync} from "../slices/noteSlice";
import { noteMapSelector } from "../selectors/noteSelectors";
import { useEffect, useRef, useState } from "react";
import { AppDispatch } from "../store";
import { Note } from "../models/note";

// Dispatches a fetch to backend for a given note
// Will only provide state updates if the id changes
export default function useNoteAsync(noteId: string) {
    const notes = useSelector(noteMapSelector)
    const [note, setNote] = useState<Note | null>(null)
    const noteIdRef = useRef(null);

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        if (noteIdRef.current == noteId) return
        if (!notes[noteId]) return
        if (!notes[noteId].hasOwnProperty("contents")) {
            dispatch(fetchNoteAsync(noteId))
            return
        }
        noteIdRef.current = noteId
        setNote(notes[noteId])

    }, [noteId, notes])
    return { note }
}
