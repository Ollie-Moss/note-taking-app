import { RefObject } from "react";
import { Group } from "../models/group";
import { useSelector } from "react-redux";
import { noteMapSelector } from "../selectors/noteSelectors";
import { groupMapSelector } from "../selectors/groupSelectors";
import GroupCard from "./groupCard";
import ItemTree from "./itemTree";

// Renders a group and its nested items (notes and groups) as a tree structure.
// Displays a GroupCard for the provided group
// Recursively renders nested groups and notes if the group is "open"
// Offsets any nested items
export function GroupTree({ dragConstraint, group, offset = 0 }: { offset?: number, dragConstraint: RefObject<HTMLUListElement>, group: Group }) {
    const groups = useSelector(groupMapSelector)
    const notes = useSelector(noteMapSelector)

    return (
        <li>
            {/* Display a single GroupCard inside its own <ul> */}
            <ul>
                <GroupCard
                    dragConstraint={dragConstraint}
                    offset={offset}
                    group={group} />
            </ul>
            {group.open ?
                <ul >
                    <ItemTree
                        // Create a list of child groups and notes:
                        // - Add type to distinguish between them
                        // - Sort items by their position for correct order
                        items={[...(group.children.map(id => ({ ...groups[id], type: "group" }))),
                        ...group.notes.map(id => ({ ...notes[id], type: "note" }))]
                            .sort((a, b) => a.position - b.position)}
                        offset={offset + 1}
                        container={dragConstraint}
                    />
                </ul>
                :
                <></>}
        </li>
    );
}

