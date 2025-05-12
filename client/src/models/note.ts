export function NewNote(): Note {
    return {
        _id: "temp_id",
        title: "",
        contents: "{}",
        favourite: false,
        editedAt: new Date(Date.now()),
        position: 0,
        uid: "",
        groupId: null
    } as Note;
}

export type Note = NotePreview & {
    uid: string,
    contents: string,
}

export type NotePreview = {
    _id: string,
    title: string,
    editedAt: Date,
    position: number,
    favourite: boolean
    groupId: string | null
}
