import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderClosed, faFolderOpen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NoteDisplay } from "./noteDisplay";
import { RefObject } from "react";
import { useConfirm } from '../lib/confirmationProvider'
import { useNavigate } from "react-router";
import { Group } from "../models/group";
import { deleteGroupAsync, groupMapSelector, moveGroupAsync, updateGroupAsync } from "../reducers/groupReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { motion } from "motion/react";
import { useDrag } from "../lib/useDrag";
import { noteMapSelector } from "../reducers/noteReducer";
import { MoveGroup } from "../controllers/groupController";

export function GroupTree({ dragConstraint, group, offset = 0 }: { offset?: number, dragConstraint: RefObject<HTMLUListElement>, group: Group }) {
    const { isDragging, dragProps } = useDrag<HTMLLIElement>({ dragConstraint, onDrop })

    const { Confirm } = useConfirm()
    const navigate = useNavigate()
    const groups = useSelector(groupMapSelector)
    const notes = useSelector(noteMapSelector)

    const dispatch: AppDispatch = useDispatch()

    function onDrop(target: Element, position: 'top' | 'middle' | 'bottom') {
        const targetId = target.getAttribute('data-item-id');
        if (target.getAttribute('data-group') && position == 'middle') {
            dispatch(updateGroupAsync({ id: group._id, group: { parentId: targetId } }));
            return
        }
        if (position == 'top' || position == 'bottom') {
            const mappedPosition = position == 'top' ? 'before' : 'after'
            //dispatch(moveNoteAsync({ id: noteId, targetId, position: mappedPosition }));

            dispatch(moveGroupAsync.pending("manual-" + Date.now(), { id: group._id, targetId, position: mappedPosition }))
        }
    }
    async function HandleDelete(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        e.stopPropagation()

        const confirmed = await Confirm("Are you sure you wish to delete this group?");
        if (!confirmed) return

        dispatch(deleteGroupAsync(group._id))

        // navigate to home if a note that was deleted was selected
        const params = new URLSearchParams(location.search)
        if (location.pathname != "/notes") return
        for (const noteId of group.notes) {
            if (params.has("id", noteId)) {
                navigate({
                    pathname: "/notes/home", search: ""
                })
            }
        }
    }

    return (
        <li>
            <ul>
                <motion.li
                    drag
                    {...dragProps}
                    onClick={() => dispatch(updateGroupAsync({ group: { open: !group.open }, id: group._id }))}
                    data-item-id={group._id}
                    data-group
                    layout layoutId={group._id}
                    style={{ ...dragProps.style, paddingLeft: 0.5 + offset + "rem" }}
                    className={`hover:bg-bg-light bg-bg-dark hover:cursor-pointer transition-colors w-full max-w-full justify-between flex items-center  py-1.5 px-2 rounded-lg`}>
                    <div className="transition-[border,background-color] w-full justify-between overflow-x-hidden flex items-center gap-[8px]">
                        <FontAwesomeIcon className="text-white h-[20px]" icon={group.open ? faFolderOpen : faFolderClosed} />
                        <p className={`flex-1 overflow-x-hidden whitespace-nowrap text-ellipsis text-xs text-white 
                                ${group.title == "" ? "opacity-[0.6] italic" : ""}`}>
                            {group.title == "" ?
                                "Untitled Group"
                                :
                                group.title
                            }</p>

                        <FontAwesomeIcon
                            onClick={HandleDelete}
                            className="hover:text-red-400 text-white size-[16px]"
                            icon={faTimes} />
                    </div>
                </motion.li>
            </ul>
            <ul >
                {group.open ?
                    <>
                        {group.notes.map(id => notes[id]).sort((a, b) => a.position - b.position).map(note => (
                            <NoteDisplay
                                draggable={true}
                                key={note._id} noteId={note._id} dragConstraint={dragConstraint} offset={offset + 1} />
                        ))}
                        {group.children.map(childId => (
                            <GroupTree key={childId} group={groups[childId]} dragConstraint={dragConstraint} offset={offset + 1} />
                        ))}
                    </>
                    :
                    <></>}
            </ul>
        </li>
    );
}
