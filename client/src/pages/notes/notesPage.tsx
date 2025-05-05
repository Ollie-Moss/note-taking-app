import Sidebar from "../../components/sidebar";
import { useEffect, useState } from "react";
import { GetNote } from "../../controllers/noteController";
import Editor from "../../components/editor";
import { useQueryParams } from "../../lib/useQueryParams";
import Search from "../../components/search";
import { QueryClient, QueryClientProvider, useQuery, } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Notes() {
    const query: URLSearchParams = useQueryParams();
    const [noteId, setNoteId] = useState<string>("");
    const [search, setSearch] = useState<boolean>(false);

    useEffect(() => {
        const noteId = query.get("id")
        const searchQuery = query.get("search")
        setNoteId(noteId ?? "")
        setSearch(searchQuery != null ? true : false)
    }, [query])

    return (
        <QueryClientProvider client={queryClient}>
            {search ?
                <Search /> :
                <></>
            }
            <div className="w-full h-full flex">
                <Sidebar />
                {!noteId || noteId === "" ?
                    <div className="h-full w-full bg-bg"></div> :
                    <NoteDisplay noteId={noteId} />
                }
            </div>
        </QueryClientProvider>
    )
}


function NoteDisplay({ noteId }: { noteId: string }) {
    const { isPending, error, data } = useQuery({
        queryKey: ['notes', noteId],
        queryFn: () => GetNote(noteId)
    })

    return (
        <div className="h-full w-full bg-bg">
            {isPending || error || !data ?
                <></>
                :
                <Editor note={data} />
            }
        </div >
    )
}

