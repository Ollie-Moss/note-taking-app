export function NewNote(): Note {
    return {
        _id: "temp_id",
        title: "",
        contents: "{}",
        uid: ""
    } as Note;
}
export type Note = {
    _id: string,
    title: string,
    contents: string,
    uid: string,
}
