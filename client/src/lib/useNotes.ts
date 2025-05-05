import { useQuery } from "@tanstack/react-query";
import { GetNotes } from "../controllers/noteController";
import { useMemo } from "react";

export default function useNotes() {
    const { isPending, error, data } = useQuery({
        queryKey: ["notes"],
        queryFn: () => GetNotes()
    })
    return { notes: data ?? [], isPending, error };
}
