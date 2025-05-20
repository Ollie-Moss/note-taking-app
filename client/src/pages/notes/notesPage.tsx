import Sidebar from "../../components/sidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "../../components/editor";
import { useQueryParams } from "../../lib/useQueryParams";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotesHomeSection from "../../components/notesHomeSection";
import { SearchProvider } from "../../lib/searchProvider";
import { useDispatch, useSelector } from "react-redux";
import { fetchNoteAsync, noteMapSelector } from "../../reducers/noteReducer";
import { Note } from "../../models/note";
import { AppDispatch } from "../../store";

const queryClient = new QueryClient()

export default function Notes({ home }: { home: boolean }) {
    const query: URLSearchParams = useQueryParams();
    return (
        <QueryClientProvider client={queryClient}>
            <SearchProvider>
                <div className="w-full h-full flex">
                    <Sidebar />
                    <div className="h-full w-full lg:w-[calc(100%-220px)] bg-bg">
                        {home ?
                            <NotesHomeSection />
                            :
                            <NoteDisplay noteId={query.get("id") ?? ""} />
                        }
                    </div>
                </div>
            </SearchProvider>
        </QueryClientProvider>
    )
}


function NoteDisplay({ noteId }: { noteId: string }) {
    // this ensures that the note editor will only rerender when navigating to a
    // different note and note when updates occur to the note
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

    return (
        <div className="h-full w-full bg-bg">
            {noteId == "" || !note ?
                <></>
                :
                <Editor note={note} />
            }
        </div >
    )
}

