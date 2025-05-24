// Default Group creator
export function NewGroup(): Group {
    return {
        title: "",
        position: 100,
        uid: "",
        parentId: null,
        open: false,
        notes: [],
        children: []
    } as Group
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
