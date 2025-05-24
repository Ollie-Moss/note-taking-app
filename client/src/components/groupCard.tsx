import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderClosed, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { RefObject, useRef, useState } from "react";
import { Group } from "../models/group";
import { moveGroupAndMaybeRegroupAsync, updateGroupAsync } from "../slices/groupSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import GroupCardTitle from "./groupCardTitle";
import { createOnDrop } from "../lib/createOnDropHandler";
import Draggable from "./draggable";


// Group with buttons for deleting and renaming it
// Onclick opens and closes the group
// Uses draggable component to allow moving it
export default function GroupCard({ dragConstraint, group, offset = 0 }: { offset?: number, dragConstraint: RefObject<HTMLUListElement>, group: Group }) {

    // title editing state
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const dispatch: AppDispatch = useDispatch()

    // drop functionality
    // updates and moves group
    const onDrop = createOnDrop({
        update: (updates) => dispatch(updateGroupAsync({ id: group._id, group: updates })),
        move: (targetId, position) => dispatch(moveGroupAndMaybeRegroupAsync({ id: group._id, targetId, position }))
    })

    const isDragging = useRef<boolean>(false)

    return (
        <Draggable
            /* Drag Properties */
            drag
            dragConstraints={dragConstraint}
            isdragging={isDragging}
            /* Animation Properties */
            layout
            layoutId={group._id}
            /* Drop Target Properties */
            data-item-id={group._id}
            data-group
            /* Events */
            onDrop={onDrop}
            onClick={() => {
                if (isEditing || isDragging.current) return
                dispatch(updateGroupAsync({ group: { open: !group.open }, id: group._id }))
            }}
            /* Styling */
            style={{ paddingLeft: 0.5 + offset + "rem" }}
            className={`hover:bg-bg-light bg-bg-dark hover:cursor-pointer transition-colors w-full max-w-full justify-between flex items-center  py-1 px-2 rounded-lg
                            ${isEditing && "bg-bg-light"} `}>
            <div
                className="transition-[border,background-color] w-full justify-between overflow-x-hidden flex items-center gap-[8px]">
                <FontAwesomeIcon className="text-white h-[20px]" icon={group.open ? faFolderOpen : faFolderClosed} />
                <GroupCardTitle
                    group={group}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />
            </div>
        </Draggable>
    )
}

