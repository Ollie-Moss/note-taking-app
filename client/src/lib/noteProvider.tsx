import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { NewNote, Note } from "../models/note";
import { CreateNote, DeleteNote, GetNote, GetNotes, UpdateNote } from "../controllers/noteController";
import { useNavigate } from "react-router";
import { useToast } from "./toastProvider";
import { CreateGroup, GetGroups, UpdateGroup } from "../controllers/groupController";
import { Group, NewGroup } from "../models/group";

const notesContext = createContext<{
    rootGroups: string[],
    ungroupedNotes: string[],
    groups: { [key: string]: Group },
    notes: { [key: string]: Note },
    getAllGroups: () => { groups: Group[], rootGroups: string[] },
    getGroup: (id: string) => Group,
    getNote: (id: string) => Note,
    getAllNotes: () => { notes: (Note)[], ungroupedNotes: string[] },
    createNote: () => void,
    createGroup: () => void,
    updateNoteLocal: (id: string, updatedNote: Partial<Note>) => void,
    updateNote: (id: string, updatedNote: Partial<Note>, notify?: boolean) => void,
    deleteNote: (noteId: string) => void
    updateGroup: (id: string, updatedGroup: Partial<Group>) => void,
    updateGroupLocal: (id: string, updatedGroup: Partial<Group>) => void,
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
    updateNote: function(id: string, updatedNote: Note, notify: boolean): void {
        throw new Error("Function not implemented.");
    },
    deleteNote: function(noteId: string): void {
        throw new Error("Function not implemented.");
    },
    getAllNotes: function(): { notes: (Note)[]; ungroupedNotes: string[]; } {
        throw new Error("Function not implemented.");
    },
    getGroup: function(id: string): Group {
        throw new Error("Function not implemented.");
    },
    updateGroup: function(id: string, updatedGroup: Partial<Group>): void {
        throw new Error("Function not implemented.");
    },
    deleteGroup: function(id: string): void {
        throw new Error("Function not implemented.");
    },
    createGroup: function(): void {
        throw new Error("Function not implemented.");
    },
    updateNoteLocal: function(id: string, updatedNote: Partial<Note>): void {
        throw new Error("Function not implemented.");
    },
    updateGroupLocal: function(id: string, updatedGroup: Partial<Group>): void {
        throw new Error("Function not implemented.");
    },
    rootGroups: [],
    ungroupedNotes: []
})

export function NotesContextProvider({ children }: Readonly<{ children: ReactNode }>) {
    const navigate = useNavigate();
    const { createNotification } = useToast();

    const [notes, setNotes] = useState<{ [key: string]: Note }>({});
    const [groups, setGroups] = useState<{ [key: string]: Group }>({});

    const [ungroupedNoteIds, setUngroupedNoteIds] = useState<string[]>([]);
    const [rootGroupIds, setRootGroupIds] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            const retrievedGroups = await GetGroups();
            const retrievedNotes = await GetNotes();

            const newGroups: { [key: string]: Group } = {};
            const newRootGroupIds: string[] = [];

            const newNotes: { [key: string]: Note } = {};
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

    async function updateGroupLocal(id: string, updatedGroup: Partial<Group>) {
        if (updatedGroup._id == "temp_id") return;
        let previousGroup: Group;
        setGroups(prev => {
            const newGroups = { ...prev }
            previousGroup = newGroups[id]
            newGroups[id] = { ...previousGroup, ...updatedGroup }
            return newGroups
        })
        if (updatedGroup.hasOwnProperty("parentId")) {
            if (previousGroup.parentId == updatedGroup.parentId) return
            setRootGroupIds(prev => {
                const prevGroups = [...prev]
                if (previousGroup.parentId == null) {
                    prevGroups.splice(prevGroups.indexOf(id), 1)
                }
                if (updatedGroup.parentId == null) {
                    prevGroups.push(id)
                }
                return prevGroups
            })
            setGroups(prev => {
                const prevGroups = { ...prev }
                if (previousGroup.parentId != null) {
                    prevGroups[previousGroup.parentId].notes.splice(prevGroups[previousGroup._id].notes.indexOf(id), 1)
                }
                if (updatedGroup.parentId != null) {
                    prevGroups[previousGroup.parentId].notes.push(id)
                }
                return prevGroups
            })
        }

    }

    async function updateGroup(id: string, updatedGroup: Partial<Group>) {
        updateGroupLocal(id, updatedGroup)

        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current[updatedGroup._id]);
        }

        autoSaveTimeoutRef.current[updatedGroup._id] = setTimeout(async () => {
            try {
                await UpdateGroup(id, updatedGroup);
            } catch (error) {
                console.error(error)
                createNotification({ message: "Something went wrong while saving a Group! ", type: "error" })
            }
        }, autoSaveDelay);
    }
    async function deleteGroup(id: string) {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current[id]);
        }
        setGroups(prev => {
            const newGroups = { ...prev }
            delete newGroups[id]
            return newGroups
        })
        setRootGroupIds(prev => {
            const prevGroups = [...prev]
            if (prevGroups.indexOf(id) != -1) {
                prevGroups.splice(prevGroups.indexOf(id), 1)
            }
            return prevGroups
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

    function updateNoteLocal(id: string, updatedNote: Partial<Note>) {
        if (updatedNote._id == "temp_id") return;
        updatedNote.editedAt = new Date(Date.now());

        let previousNote: Note;
        setNotes(prev => {
            const newNotes = { ...prev }
            previousNote = newNotes[id];

            newNotes[id] = { ...previousNote, ...updatedNote }
            return newNotes
        })

        if (updatedNote.hasOwnProperty("parentId")) {
            if (!previousNote || previousNote.parentId == updatedNote.parentId) return
            setUngroupedNoteIds(prev => {
                const prevNotes = [...prev]
                if (previousNote.parentId == null) {
                    prevNotes.splice(prevNotes.indexOf(id), 1)
                }
                if (updatedNote.parentId == null) {
                    prevNotes.push(id)
                }
                return prevNotes
            })
            setGroups(prev => {
                const prevGroups = { ...prev }

                let index = prevGroups[previousNote.parentId].notes.indexOf(id)
                if (previousNote.parentId != null && index != -1) {
                    prevGroups[previousNote.parentId].notes.splice(index, 1)
                }

                index = prevGroups[updatedNote.parentId].notes.indexOf(id)
                if (updatedNote.parentId != null && index == -1) {
                    prevGroups[updatedNote.parentId].notes.push(id)
                }
                return prevGroups
            })
        }
    }

    function updateNote(id: string, updatedNote: Partial<Note>, notify: boolean = false) {
        updateNoteLocal(id, updatedNote);

        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current[updatedNote._id]);
        }

        autoSaveTimeoutRef.current[updatedNote._id] = setTimeout(async () => {
            try {
                await UpdateNote(id, updatedNote);
                if (notify) {
                    createNotification({ message: "Saved Note!", type: "success" })
                }
            } catch (error) {
                console.error(error)
                if (notify) {
                    createNotification({ message: "Something went wrong while saving! ", type: "error" })
                }
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

        if (notes[noteId].parentId != null) {
            const prevGroupId = notes[noteId].parentId
            const prevNotes = groups[prevGroupId].notes
            prevNotes.splice(prevNotes.indexOf(noteId), 1)
            updateGroupLocal(prevGroupId, { ...groups[prevGroupId], notes: prevNotes })
        }
        setUngroupedNoteIds(prev => {
            const prevNotes = [...prev]
            if (prevNotes.indexOf(noteId) != -1) {
                prevNotes.splice(prevNotes.indexOf(noteId), 1)
            }
            return prevNotes
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
            ungroupedNotes: ungroupedNoteIds,
            rootGroups: rootGroupIds,
            createGroup,
            updateGroupLocal,
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
            updateNoteLocal,
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
    const { notes, ungroupedNotes, createNote, updateNote, deleteNote } = useNotesProvider()
    const notesAsArray = useMemo(() => Object.values(notes), [notes])

    return { notes: notesAsArray, ungroupedNotes, createNote, updateNote, deleteNote }
}

export function useGroups() {
    const { groups, rootGroups, createGroup, updateGroup, deleteGroup } = useNotesProvider()
    const groupsAsArray = useMemo(() => Object.values(groups), [groups])
    return { groups: groupsAsArray, rootGroups, createGroup, updateGroup, deleteGroup }
}

export function useNoteFromServer(id: string) {
    const { notes, updateNoteLocal, updateNote } = useNotesProvider()
    const [note, setNote] = useState<Note>(notes[id])

    const prevIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (id === "" || id === prevIdRef.current) return;
        prevIdRef.current = id;

        GetNote(id).then(newNote => {
            setNote(newNote);
            updateNoteLocal(newNote._id, { contents: newNote.contents })
        })
    }, [id, updateNoteLocal])

    return { note, updateNoteLocal, updateNote }
}

export function useNote(id: string) {
    const { notes, getNote, createNote, updateNote, deleteNote } = useNotesProvider()
    const [note, setNote] = useState<Note>(notes[id])
    useEffect(() => {
        if (notes[id] != note) {
            setNote(notes[id]);
        }
    }, [id, notes])
    return { note, createNote, updateNote, deleteNote }
}

export function useGroup(id: string) {
    const { notes, groups, getGroup, updateGroup, updateGroupLocal, deleteGroup } = useNotesProvider()
    const [group, setGroup] = useState<Group>(groups[id])

    useEffect(() => {
        if (groups[id] != group) {
            const newGroup = groups[id];
            newGroup.notes = newGroup.notes.sort((a, b) => notes[a].position - notes[b].position)
            setGroup(newGroup)
        }
    }, [id, groups, notes])

    return { group, updateGroup, updateGroupLocal, deleteGroup }
}
