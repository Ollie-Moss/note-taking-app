import Sidebar from "../../components/sidebar";
import Editor from "../../components/editor";
import { useQueryParams } from "../../lib/useQueryParams";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotesHomeSection from "../../components/notesHomeSection";
import { SearchProvider } from "../../lib/searchProvider";
import useNoteAsync from "../../hooks/useNoteAsync";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa0, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useSidebar } from "../../lib/sidebarProvider";

const queryClient = new QueryClient()

export default function Notes({ home }: { home: boolean }) {
    const query: URLSearchParams = useQueryParams();

    const { toggleSideBar } = useSidebar()

    return (
        <QueryClientProvider client={queryClient}>
            <SearchProvider>
                <div className="w-full bg-bg-dark p-5 block lg:hidden">
                    {/* Toggle Button (visible only on mobile) */}
                    <FontAwesomeIcon
                        className="size-10 z-10 text-white"
                        icon={faBars}
                        onClick={toggleSideBar}
                    />
                </div>
                <div className="w-full h-full flex">
                    <Sidebar />
                    <div className="h-full w-full lg:w-[80%] bg-bg">
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
    const { note } = useNoteAsync(noteId)

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
