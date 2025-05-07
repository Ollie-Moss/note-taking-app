import { useQuery } from "@tanstack/react-query";
import { GetNotes } from "../controllers/noteController";

export default function useNotesQuery() {
    const { isPending, error, data } = useQuery({
        queryKey: ["notes"],
        queryFn: () => GetNotes()
    })
    return { notes: data ?? [], isPending, error };
}
