import Sidebar from "../../components/sidebar";
import { useQueryParams } from "../../lib/useQueryParams";
import NotesHomeSection from "../../components/notesHomeSection";
import { SearchProvider } from "../../lib/searchProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "../../lib/sidebarProvider";
import NoteEditorDisplay from "../../components/noteEditorDisplay";

// Main Notes page component
// Displays sidebar (always visible on large screens)
// Main content area: Home section or note editor
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
                <div className="h-full w-full lg:w-[75%] bg-bg">
                    {home ?
                        <NotesHomeSection /> // Home section if "home" is true
                        :
                        <NoteEditorDisplay noteId={query.get("id") ?? ""} />
                    }
                </div>
            </div>
        </SearchProvider>
    )
}


