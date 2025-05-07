import { createContext, ReactNode, useContext, useMemo, useRef } from "react";
import { NewNote, Note } from "../models/note";
import useNotesQuery from "./useNotesQuery";
import { useQueryClient } from "@tanstack/react-query";
import { CreateNote, DeleteNote, UpdateNote } from "../controllers/noteController";
import { useNavigate } from "react-router";

const notesContext = createContext<{
    notes: Note[],
    getNote: (noteId: string) => Note | null
    createNote: () => void
    updateNote: (updatedNote: Note) => void
    deleteNote: (noteId: string) => void
    refreshNotes: () => void
}>({
    notes: [],
    updateNote: function(updatedNote: Note): void {
        throw new Error("Function not implemented.");
    },
    deleteNote: function(noteId: string): void {
        throw new Error("Function not implemented.");
    },
    refreshNotes: function(): void {
        throw new Error("Function not implemented.");
    },
    getNote: function(noteId: string): Note | null {
        throw new Error("Function not implemented.");
    },
    createNote: function(): void {
        throw new Error("Function not implemented.");
    }
});

export function NotesContextProvider({ children }: Readonly<{ children: ReactNode }>) {
    const { notes, isPending, error } = useNotesQuery();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const autoSaveDelay = 2000;
    const autoSaveTimeoutRef = useRef<{ [key: number]: number }>({});

    function updateNote(updatedNote: Note) {
        if (updatedNote._id == "temp_id") return;

        let prevNotes: Note[] = [];
        queryClient.setQueryData(["notes"],
            (prev: Note[]) => {
                prevNotes = prev;
                return prev?.map((note: Note) => note._id == updatedNote._id ? updatedNote : note)
            });

        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current[updatedNote._id]);
        }

        autoSaveTimeoutRef.current[updatedNote._id] = setTimeout(async () => {
            try {
                await UpdateNote(updatedNote);
            } catch (error) {
                // note was not updated so roll back query client
                queryClient.setQueryData(["notes"], (prev: Note[]) => prevNotes);
            }
        }, autoSaveDelay);
    }

    async function deleteNote(noteId: string) {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current[noteId]);
        }

        let prevNotes: Note[] = [];
        queryClient.setQueryData(["notes"],
            (prev: Note[]) => prev.filter(note => note._id != noteId));
        try {
            await DeleteNote(noteId);
        } catch (error) {
            // note was not updated so roll back query client
            queryClient.setQueryData(["notes"], (prev: Note[]) => prevNotes);
        }
    }

    async function createNote() {
        const note: Note = NewNote();
        try {
            let newNote = await CreateNote(note);
            queryClient.setQueryData(["notes"],
                (prev: Note[]) => [...prev, newNote]);
        } catch (error) {
            // note
            console.log(error)
            console.log("Note could not be created");
        }
    }

    function getNote(noteId: string): Note | null {
        const filteredNotes: Note[] = notes.filter(note => note._id == noteId);
        return filteredNotes.length > 0 ? filteredNotes[0] : {
            _id: noteId,
            title: "",
            contents: "{}",
            uid: ""
        }
    }

    async function refreshNotes() {
        queryClient.invalidateQueries({ queryKey: ["notes"] })
    }

    return (
        <notesContext.Provider value={{ notes, createNote, getNote, updateNote, deleteNote, refreshNotes }}>
            {children}
        </notesContext.Provider>
    )
}

export function useNotes(id?: string) {
    const ctx = useContext(notesContext)
    return {
        ...ctx,
        note: ctx.getNote(id ?? "")
    }
}

