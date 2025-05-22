import Sidebar from "../../components/sidebar";
import Editor from "../../components/editor";
import { useQueryParams } from "../../lib/useQueryParams";
import NotesHomeSection from "../../components/notesHomeSection";
import { SearchProvider } from "../../lib/searchProvider";
import useNoteAsync from "../../hooks/useNoteAsync";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "../../lib/sidebarProvider";
import LoadingSpinner from "../../components/spinner";


export default function Notes({ home }: { home: boolean }) {
    const query: URLSearchParams = useQueryParams();

    const { toggleSidebar } = useSidebar()

    return (
        <SearchProvider>
            {/* Toggle Button visible only on mobile */}
            <div className="w-full bg-bg-dark p-5 block lg:hidden">
                <FontAwesomeIcon
                    className="size-10 z-10 text-white"
                    icon={faBars}
                    onClick={toggleSidebar}
                />
            </div>

            {/* Main page content */}
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
    )
}


function NoteDisplay({ noteId }: { noteId: string }) {
    // this ensures that the note editor will only rerender when navigating to a
    // different note and note when updates occur to the note
    const { loading, note } = useNoteAsync(noteId)

    return (
        <div className="h-full w-full bg-bg">
            {noteId == "" || loading || !note ?
                <div className="px-12 pt-10 lg:px-24">
                    <LoadingSpinner />
                </div>
                :
                <Editor note={note} />
            }
        </div >
    )
}
