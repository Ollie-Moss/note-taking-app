// Default Group creator
export function NewGroup(): Group {
    return {
        _id: "temp_id",
        title: "",
        position: 100,
        uid: "",
        parentId: null,
        open: false,
        notes: [],
        children: []
    }
}

// Group Model
export type Group = {
    _id: string,
    title: string,
    position: number,
    uid: string,
    parentId: string | null,
    open: boolean,
    notes: string[],
    children: string[]
}
