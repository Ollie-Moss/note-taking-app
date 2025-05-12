import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { NewNote, Note, NotePreview } from "../models/note";
import { CreateNote, DeleteNote, GetNote, GetNotes, UpdateNote } from "../controllers/noteController";
import { useNavigate } from "react-router";
import { useToast } from "./toastProvider";
import { GetGroups } from "../controllers/groupController";
import { Group } from "../models/group";

const notesContext = createContext<{
    groups: { [key: string]: Group },
    notes: { [key: string]: Note & { preview?: boolean } },
    getGroups: () => Group[],
    getNote: (id: string) => Promise<Note>,
    getAllNotes: () => Note[],
    createNote: () => void,
    updateNote: (updatedNote: Note) => void,
    deleteNote: (noteId: string) => void
}>({
    getGroups: function(): Group[] {
        throw new Error("Function not implemented.");
    },
    getNote: function(): Promise<Note> {
        throw new Error("Function not implemented.");
    },
    getAllNotes: function(): Note[] {
        throw new Error("Function not implemented.");
    },
    createNote: function(): void {
        throw new Error("Function not implemented.");
    },
    updateNote: function(): void {
        throw new Error("Function not implemented.");
    },
    deleteNote: function(): void {
        throw new Error("Function not implemented.");
    },
    groups: {},
    notes: {}
});


export function NotesContextProvider({ children }: Readonly<{ children: ReactNode }>) {
    const navigate = useNavigate();
    const { createNotification } = useToast();

    const [notes, setNotes] = useState<{ [key: string]: Note | NotePreview }>({});
    const [groups, setGroups] = useState<{ [key: string]: Group }>({});

    const [ungroupedNoteIds, setUngroupedNoteIds] = useState<string[]>([]);
    const [rootGroupIds, setRootGroupIds] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const retrievedGroups = await GetGroups();
            const retrievedNotes = await GetNotes();

            const newGroups: { [key: string]: Group } = {};
            const newRootGroupIds: string[] = [];

            const newNotes: { [key: string]: Note | NotePreview } = {};
            const newUngroupedNoteIds: string[] = [];

            for (const group of retrievedGroups.groups) {
                newGroups[group._id] = group;
                if (!group.parentId) {
                    newRootGroupIds.push(group._id);
                }
            }

            for (const note of retrievedNotes.notes) {
                newNotes[note._id] = note;
                if (!note.groupId) {
                    newUngroupedNoteIds.push(note._id);
                }
            }

            setGroups(newGroups);
            setRootGroupIds(newRootGroupIds);
            setNotes(newNotes);
            setUngroupedNoteIds(newUngroupedNoteIds);
        })();
    }, [])

    function SetGroup(group: Group) {
        setGroups(prev => {
            const newGroups = { ...prev }
            newGroups[group._id] = group;
            return newGroups
        })
    }

    function SetNote(note: Note) {
        setNotes(prev => {
            const newNotes = { ...prev }
            newNotes[note._id] = note;
            return newNotes
        })
    }

    const autoSaveDelay = 2000;
    const autoSaveTimeoutRef = useRef<{ [key: number]: number }>({});

    async function getNote(noteId: string) {
        if (!notes[noteId]) {
            const note = await GetNote(noteId);
            SetNote(note)
            return note;
        }
        return notes[noteId];
    }

    function updateNote(updatedNote: Note) {
        if (updatedNote._id == "temp_id") return;
        updatedNote.editedAt = new Date(Date.now());

        SetNote(updatedNote)

        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current[updatedNote._id]);
        }

        autoSaveTimeoutRef.current[updatedNote._id] = setTimeout(async () => {
            try {
                await UpdateNote(updatedNote);
                createNotification({ message: "Saved Note!", type: "success" })
            } catch (error) {
                console.error(error)
                createNotification({ message: "Something went wrong while saving! ", type: "error" })
            }
        }, autoSaveDelay);
    }

    async function deleteNote(noteId: string) {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current[noteId]);
        }

        setNotes(prev => {
            delete prev[noteId];
            return prev
        })

        try {
            await DeleteNote(noteId);
        } catch (error) {
            // note was not updated so roll back query client
        }
    }

    async function createNote() {
        const note: Note = NewNote();
        try {
            let newNote = await CreateNote(note);
            SetNote(newNote)
            navigate({ pathname: "/notes", search: `?id=${newNote._id}` })
        } catch (error) {
            // note
            console.log(error)
            console.log("Note could not be created");
        }
    }

    return (
        <notesContext.Provider value={{ groups, notes, getAllNotes, getGroups, getNote, createNote, updateNote, deleteNote }}>
            {children}
        </notesContext.Provider>
    )
}

function useNotesProvider() {
    return useContext(notesContext)
}

export function useNotesOperations() {
    const { createNote, updateNote, deleteNote } = useNotesProvider()
    return { createNote, updateNote, deleteNote }
}

export function useNotes() {
    const { getAllNotes, createNote, updateNote, deleteNote } = useNotesProvider()
    const [notes, setNotes] = useState<Note[]>([])

    useEffect(() => {
        setNotes(getAllNotes())
        console.log(getAllNotes())
    }, [getAllNotes])

    return { notes, createNote, updateNote, deleteNote }
}

export function useGroups() {
    const { getGroups, createNote, updateNote, deleteNote } = useNotesProvider()
    const [groups, setGroups] = useState<Group[]>([])

    useEffect(() => {
        setGroups(getGroups())
    }, [getGroups])

    return { groups, createNote, updateNote, deleteNote }
}

export function useNote(id: string, recieveUpdates: boolean = true) {
    const { getNote, createNote, updateNote, deleteNote } = useNotesProvider()
    const [note, setNote] = useState<Note | null>(null)

    if (recieveUpdates) {
        useEffect(() => {
            getNote(id).then(newNote => {
                setNote(newNote);
            })
        }, [id, getNote])
    } else {
        useEffect(() => {
            GetNote(id).then(newNote => {
                setNote(newNote);
            })
        }, [id])
    }

    if (recieveUpdates) return { note, createNote, updateNote, deleteNote }
    return { note }
}
