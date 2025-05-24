// Default Note creator
export function NewNote(): Note {
    return {
        title: "",
        contents: "{}",
        favourite: false,
        editedAt: new Date(Date.now()),
        position: 100,
        uid: "",
        parentId: null
    } as Note;
}

// Note Model
export type Note = {
    _id: string,
    title: string,
    editedAt: Date,
    position: number,
    favourite: boolean
    parentId: string | null
    uid?: string,
    contents?: string,
}
