import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { NewNote, Note, NotePreview } from "../models/note";
import { CreateNote, DeleteNote, GetNote, GetNotes, UpdateNote } from "../controllers/noteController";
import { useNavigate } from "react-router";
import { useToast } from "./toastProvider";
import { CreateGroup, GetGroups, UpdateGroup } from "../controllers/groupController";
import { Group, NewGroup } from "../models/group";

const notesContext = createContext<{
    groups: { [key: string]: Group },
    notes: { [key: string]: Note | NotePreview },
    getAllGroups: () => { groups: Group[], rootGroups: string[] },
    getGroup: (id: string) => Group,
    getNote: (id: string) => Note | NotePreview,
    getAllNotes: () => { notes: (Note | NotePreview)[], ungroupedNotes: string[] },
    createNote: () => void,
    createGroup: () => void,
    updateNote: (updatedNote: Note) => void,
    deleteNote: (noteId: string) => void
    updateGroup: (updatedGroup: Group) => void,
    deleteGroup: (id: string) => void
}>({
    groups: {},
    notes: {},
    getAllGroups: function(): { groups: Group[]; rootGroups: string[]; } {
        throw new Error("Function not implemented.");
    },
    getNote: function(id: string): Note {
        throw new Error("Function not implemented.");
    },
    createNote: function(): void {
        throw new Error("Function not implemented.");
    },
    updateNote: function(updatedNote: Note): void {
        throw new Error("Function not implemented.");
    },
    deleteNote: function(noteId: string): void {
        throw new Error("Function not implemented.");
    },
    getAllNotes: function(): { notes: (Note | NotePreview)[]; ungroupedNotes: string[]; } {
        throw new Error("Function not implemented.");
    },
    getGroup: function(id: string): Group {
        throw new Error("Function not implemented.");
    },
    updateGroup: function(updatedGroup: Group): void {
        throw new Error("Function not implemented.");
    },
    deleteGroup: function(id: string): void {
        throw new Error("Function not implemented.");
    },
    createGroup: function(): void {
        throw new Error("Function not implemented.");
    }
})

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

            for (const group of retrievedGroups) {
                newGroups[group._id] = group;
                if (!group.parentId) {
                    newRootGroupIds.push(group._id);
                }
            }

            for (const note of retrievedNotes) {
                newNotes[note._id] = note;
                if (!note.parentId) {
                    newUngroupedNoteIds.push(note._id);
                }
            }
            setGroups(newGroups);
            setRootGroupIds(newRootGroupIds);
            setNotes(newNotes);
            setUngroupedNoteIds(newUngroupedNoteIds);
        })();
    }, [])

    const autoSaveDelay = 2000;
    const autoSaveTimeoutRef = useRef<{ [key: number]: number }>({});

    function getAllGroups() {
        return { groups: Object.values(groups), rootGroups: rootGroupIds }
    }
    function getAllNotes() {
        return { notes: Object.values(notes), ungroupedNotes: ungroupedNoteIds }
    }

    function getGroup(id: string) {
        return groups[id];
    }
    async function createGroup() {
        const group: Group = NewGroup();
        try {
            let newGroup = await CreateGroup(group);
            setGroups(prev => {
                const newGroups = { ...prev }
                newGroups[newGroup._id] = newGroup
                return newGroups
            })

        } catch (error) {
            // note
            console.log(error)
            console.log("Note could not be created");
        }
    }

    async function updateGroup(updatedGroup: Group) {
        if (updatedGroup._id == "temp_id") return;
        setGroups(prev => {
            const newGroups = { ...prev }
            newGroups[updatedGroup._id] = updatedGroup
            return newGroups
        })
        try {
            await UpdateGroup(updatedGroup)
        } catch (error) {

        }
    }
    async function deleteGroup(id: string) {
        setGroups(prev => {
            const newGroups = { ...prev }
            delete newGroups[id]
            return newGroups
        })

        try {
            await DeleteNote(id);
        } catch (error) {
            // note was not updated so roll back query client
        }
    }

    function getNote(noteId: string) {
        return notes[noteId];
    }

    async function retrieveNote(noteId: string) {
        const note = await GetNote(noteId);
        setNotes(prev => {
            const newNotes = { ...prev }
            newNotes[noteId] = note
            return newNotes
        })
        return note;
    }

    function updateNote(updatedNote: Note) {
        if (updatedNote._id == "temp_id") return;
        updatedNote.editedAt = new Date(Date.now());

        setNotes(prev => {
            const newNotes = { ...prev }
            newNotes[updatedNote._id] = updatedNote
            return newNotes
        })

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
            const newNotes = { ...prev }
            delete newNotes[noteId];
            return newNotes
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
            setNotes(prev => {
                const newNotes = { ...prev }
                newNotes[newNote._id] = newNote
                return newNotes
            })

            navigate({ pathname: "/notes", search: `?id=${newNote._id}` })
        } catch (error) {
            // note
            console.log(error)
            console.log("Note could not be created");
        }
    }

    return (
        <notesContext.Provider value={{
            createGroup,
            updateGroup,
            deleteGroup,
            getGroup,
            getAllGroups,
            getAllNotes,
            groups,
            notes,
            getNote,
            createNote,
            updateNote,
            deleteNote
        }}>
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
    const [notes, setNotes] = useState<(Note | NotePreview)[]>([])
    const [ungroupedNotes, setUngroupedNotes] = useState<string[]>([])

    useEffect(() => {
        const results = getAllNotes()
        setNotes(results.notes)
        setUngroupedNotes(results.ungroupedNotes)
    }, [getAllNotes, setNotes, setUngroupedNotes])

    return { notes, ungroupedNotes, createNote, updateNote, deleteNote }
}

export function useGroups() {
    const { getAllGroups, createGroup, updateGroup, deleteGroup } = useNotesProvider()
    const [groups, setGroups] = useState<Group[]>([])
    const [rootGroups, setRootGroups] = useState<string[]>([])

    useEffect(() => {
        const results = getAllGroups()
        setGroups(results.groups)
        setRootGroups(results.rootGroups)
    }, [getAllGroups])

    return { groups, rootGroups, createGroup, updateGroup, deleteGroup }
}

export function useNote(id: string, recieveUpdates: boolean = true) {
    const { notes, getNote, createNote, updateNote, deleteNote } = useNotesProvider()
    const [note, setNote] = useState<Note | NotePreview>(notes[id])

    if (recieveUpdates) {
        useEffect(() => {
            setNote(notes[id]);
        }, [id, getNote])
    } else {
        useEffect(() => {
            if (id == "") return
            GetNote(id).then(newNote => {
                setNote(newNote);
            })
        }, [id])
    }

    if (recieveUpdates) return { note, createNote, updateNote, deleteNote }
    return { note }
}

export function useGroup(id: string) {
    const { groups, getGroup } = useNotesProvider()
    const [group, setGroup] = useState<Group>(groups[id])

    useEffect(() => {
        setGroup(getGroup(id))
    }, [id, getGroup])

    return { group }
}
