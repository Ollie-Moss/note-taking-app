import Sidebar from "../../components/sidebar";
import { useEffect, useState } from "react";
import { GetNote } from "../../controllers/noteController";
import Editor from "../../components/editor";
import { useQueryParams } from "../../lib/useQueryParams";
import Search from "../../components/search";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotesContextProvider } from "../../lib/noteContext";
import { Note } from "../../models/note";
import { useNavigate } from "react-router";
import Header from "../../components/header";

const queryClient = new QueryClient()

export default function Notes({ home }: { home: boolean }) {
    const query: URLSearchParams = useQueryParams();
    const [noteId, setNoteId] = useState<string>("");
    const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

    useEffect(() => {
        const noteId = query.get("id")
        setNoteId(noteId ?? "")
    }, [query])

    return (
        <QueryClientProvider client={queryClient}>
            <NotesContextProvider>
                <Search isOpen={isSearchVisible} closeSearch={() => setIsSearchVisible(false)} />
                <div className="w-full h-full flex">
                    <Sidebar onSearchClick={() => setIsSearchVisible(prev => !prev)} />
                    {home ?
                        <div>Home</div>
                        :
                        <NoteDisplay noteId={noteId} />
                    }
                </div>
            </NotesContextProvider>
        </QueryClientProvider>
    )
}


function NoteDisplay({ noteId }: { noteId: string }) {
    // Note editor cannot depend on the notes state in the context
    // as when it makes changes to it, it will cause a re-render
    // thus placing the cursor at the start of the input fields and
    // other issues
    const navigate = useNavigate();
    const [note, setNote] = useState<Note | null>(null);

    useEffect(() => {
        GetNote(noteId)
            .then(newNote => {
                setNote(newNote)
            }).catch(err => {
                setNote(null);
                navigate({ pathname: "/notes", search: "" })
            });
    }, [noteId])

    return (
        <div className="h-full w-full bg-bg">
            {!noteId || noteId == "" || !note ?
                <></>
                :
                <Editor note={note} />
            }
        </div >
    )
}

