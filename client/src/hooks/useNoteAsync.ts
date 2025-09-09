import { useEffect, useState } from "react";
import { Note } from "../models/note";
import { GetNote } from "../controllers/noteController";
import { getCookie } from "../lib/cookies";

// Dispatches a fetch to backend for a given note 
// Will only provide a full note (requires content)
// Will only provide state updates if the id changes
export default function useNoteAsync(noteId: string) {
    // current note state
    const [note, setNote] = useState<Note | null>(null)
    // if loading from server
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            setLoading(true);
            const noteData = await GetNote(noteId, getCookie('token'));
            setNote(noteData);
            setLoading(false);

        })();

    }, [noteId])

    return { loading, note }
}
