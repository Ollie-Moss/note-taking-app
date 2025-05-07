export function NewNote(): Note {
    return {
        _id: "temp_id",
        title: "",
        contents: "{}",
        favourite: false,
        editedAt: new Date(Date.now()),
        uid: "",
    } as Note;
}
export type Note = {
    _id: string,
    title: string,
    contents: string,
    favourite: boolean,
    editedAt: Date,
    uid: string,
}
