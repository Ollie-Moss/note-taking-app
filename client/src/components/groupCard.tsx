import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderClosed, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { RefObject, useState } from "react";
import { Group } from "../models/group";
import { moveGroupAndMaybeRegroupAsync, updateGroupAsync } from "../slices/groupSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { motion } from "motion/react";
import { useDrag } from "../lib/useDrag";
import GroupCardTitle from "./groupCardTitle";
import { createOnDrop } from "../lib/createOnDropHandler";


export default function GroupCard({ dragConstraint, group, offset = 0 }: { offset?: number, dragConstraint: RefObject<HTMLUListElement>, group: Group }) {

    const [isEditing, setIsEditing] = useState<boolean>(false)

    const dispatch: AppDispatch = useDispatch()

    const onDrop = createOnDrop({
        update: (updates) => dispatch(updateGroupAsync({ id: group._id, group: updates })),
        move: (targetId, position) => dispatch(moveGroupAndMaybeRegroupAsync({ id: group._id, targetId, position }))
    })


    const { isDragging, dragProps } = useDrag<HTMLLIElement>({ dragConstraint, onDrop })

    return (
        <motion.li
            drag
            {...dragProps}
            onClick={() => {
                if (isEditing || isDragging.current) return
                dispatch(updateGroupAsync({ group: { open: !group.open }, id: group._id }))
            }
            }
            data-item-id={group._id}
            data-group
            layout layoutId={group._id}
            style={{ ...dragProps.style, paddingLeft: 0.5 + offset + "rem" }
            }
            className={`hover:bg-bg-light bg-bg-dark hover:cursor-pointer transition-colors w-full max-w-full justify-between flex items-center  py-1 px-2 rounded-lg
                            ${isEditing && "bg-bg-light"} `}>
            <div className="transition-[border,background-color] w-full justify-between overflow-x-hidden flex items-center gap-[8px]">
                <FontAwesomeIcon className="text-white h-[20px]" icon={group.open ? faFolderOpen : faFolderClosed} />
                <GroupCardTitle
                    group={group}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                />
            </div>
        </motion.li >
    )
}

