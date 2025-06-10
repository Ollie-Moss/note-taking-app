import Sidebar from "../../components/sidebar";
import { useQueryParams } from "../../lib/useQueryParams";
import NotesHomeSection from "../../components/notesHomeSection";
import { SearchProvider } from "../../lib/searchProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "../../lib/sidebarProvider";
import NoteEditorDisplay from "../../components/noteEditorDisplay";
import { use, useEffect } from "react";
import { fetchGroupsAsync } from "../../slices/groupSlice";
import { fetchNotesAsync } from "../../slices/noteSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { userSelector } from "../../selectors/userSelector";
import Header from "../../components/header";
import { Link } from "react-router";
import LoadingSpinner from "../../components/spinner";

// Main Notes page component
// Displays sidebar (always visible on large screens)
// Main content area: Home section or note editor
export default function Notes({ home }: { home: boolean }) {
    const query: URLSearchParams = useQueryParams();

    const { toggleSidebar } = useSidebar()

    const dispatch = useDispatch<AppDispatch>()
    const { user, loading, error } = useSelector(userSelector);

    // Get user data notes, and groups
    useEffect(() => {
        if (user) {
            dispatch(fetchGroupsAsync())
            dispatch(fetchNotesAsync())
        }
    }, [dispatch, user])

    // Display loading spinner if user data is loading
    if (loading) return (
        <div>
            <Header />
            <main className="flex flex-col h-full items-center justify-center text-center py-20 px-4">
                <LoadingSpinner />
            </main>
        </div>
    )

    // Display error page if user is not logged in
    if (!user) return (
        <div>
            <Header />
            <main className="flex flex-col h-full items-center justify-center text-center py-20 px-4">
                <h1 className="text-6xl font-bold text-white">401</h1>
                <p className="text-2xl mt-4 font-semibold text-gray-300">Unauthorized!</p>
                <p className="mt-2 text-gray-400 text-center max-w-md">
                    You must be logged in to view this page
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-white text-bg-dark px-6 py-3 rounded-lg shadow hover:bg-gray-400 transition" >
                    Go Back Home
                </Link>
            </main>
        </div>
    )

    // Notes page
    return (
        <SearchProvider>
            <Header>
                {/* Toggle Button visible only on mobile */}
                    <FontAwesomeIcon
                        className="lg:hidden size-10 z-10 text-white"
                        icon={faBars}
                        onClick={toggleSidebar}
                    />
            </Header >
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


