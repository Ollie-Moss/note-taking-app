import Sidebar from "../../components/sidebar";
import { useEffect, useState } from "react";
import { GetNote } from "../../controllers/noteController";
import Editor from "../../components/editor";
import { useQueryParams } from "../../lib/useQueryParams";
import Search from "../../components/search";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Note } from "../../models/note";
import { useNavigate } from "react-router";
import Header from "../../components/header";
import NotesHomeSection from "../../components/notesHomeSection";
import { SearchProvider } from "../../lib/searchProvider";
import { NotesContextProvider, useNote } from "../../lib/noteProvider";

const queryClient = new QueryClient()

export default function Notes({ home }: { home: boolean }) {
    const query: URLSearchParams = useQueryParams();
    return (
        <QueryClientProvider client={queryClient}>
            <NotesContextProvider>
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
    const { note } = useNote(noteId, false)

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

