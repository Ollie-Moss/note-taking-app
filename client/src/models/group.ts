import { Note } from "./note"

export type Group = {
    _id: string,
    title: string,
    position: number,
    uid: string,
    parentId: string | null,
    open: boolean,
    notes: Note[]
}
