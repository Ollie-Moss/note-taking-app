import { useDispatch, useSelector } from "react-redux";
import { fetchNoteAsync, noteMapSelector } from "../reducers/noteReducer";
import { useEffect, useRef, useState } from "react";
import { AppDispatch } from "../store";
import { Note } from "../models/note";

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
