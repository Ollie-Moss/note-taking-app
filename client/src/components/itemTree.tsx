import { useRef } from "react"
import { AnimatePresence } from "motion/react"
import { GroupTree } from "./groupTree"
import { NoteCard } from "./noteCard"
import { Group } from "../models/group"
import { Note } from "../models/note"

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


