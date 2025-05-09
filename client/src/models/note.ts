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

export type Note = {
    _id: string,
    title: string,
    contents: string,
    favourite: boolean,
    editedAt: Date,
    position: number,
    uid: string,
    groupId: string | null
}
