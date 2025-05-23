import { NoteCard } from "./noteCard";
import { RefObject } from "react";
import { Group } from "../models/group";
import { useSelector } from "react-redux";
import { noteMapSelector } from "../selectors/noteSelectors";
import { groupMapSelector } from "../selectors/groupSelectors";
import GroupCard from "./groupCard";
import ItemTree from "./itemTree";

export function GroupTree({ dragConstraint, group, offset = 0 }: { offset?: number, dragConstraint: RefObject<HTMLUListElement>, group: Group }) {
    const groups = useSelector(groupMapSelector)
    const notes = useSelector(noteMapSelector)

    return (
        <li>
            <ul>
                <GroupCard
                    dragConstraint={dragConstraint}
                    offset={offset}
                    group={group} />
            </ul>
            {group.open ?
                <ul >
                    <ItemTree
                        items={[...(group.children.map(id => ({ ...groups[id], type: "group" }))), ...group.notes.map(id => ({ ...notes[id], type: "note" }))].sort((a, b) => a.position - b.position)}
                        offset={offset + 1}
                        container={dragConstraint}
                    />
                </ul>
                :
                <></>}
        </li>
    );
}

