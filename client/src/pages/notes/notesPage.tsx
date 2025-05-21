import Sidebar from "../../components/sidebar";
import Editor from "../../components/editor";
import { useQueryParams } from "../../lib/useQueryParams";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NotesHomeSection from "../../components/notesHomeSection";
import { SearchProvider } from "../../lib/searchProvider";
import useNoteAsync from "../../hooks/useNoteAsync";

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
