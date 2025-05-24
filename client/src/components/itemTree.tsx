import { GroupTree } from "./groupTree"
import { NoteCard } from "./noteCard"
import { Group } from "../models/group"
import { Note } from "../models/note"

// Recursively renders a mixed list of groups and notes
// Groups are rendered using GroupTree 
// Notes are rendered using NoteCard
// Supports indentation using the offset prop
export default function ItemTree({ items, container, offset = 0 }: {
    offset?: number,
    items: (Group & { type: string } | Note & { type: string })[],
    container: React.RefObject<any>
}) {
    return (
        <ul className="space-y-1">
            {items.map(item =>
                item.type === "group" ? (
                    <GroupTree
                        key={item._id}
                        group={item as Group}
                        offset={offset}
                        dragConstraint={container}
                    />
                ) : (
                    <NoteCard
                        key={item._id}
                        noteId={item._id}
                        offset={offset}
                        draggable={true}
                        dragConstraint={container}
                    />
                )
            )}
        </ul>
    )
}


