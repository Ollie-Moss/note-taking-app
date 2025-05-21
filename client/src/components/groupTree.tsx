import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faFolderClosed, faFolderOpen, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NoteDisplay } from "./noteDisplay";
import { RefObject, useEffect, useRef, useState } from "react";
import { useConfirm } from '../lib/confirmationProvider'
import { useNavigate } from "react-router";
import { Group } from "../models/group";
import { deleteGroupAsync, groupMapSelector, moveGroupAndMaybeRegroupAsync, moveGroupAsync, updateGroupAsync } from "../reducers/groupReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { motion } from "motion/react";
import { useDrag } from "../lib/useDrag";
import { noteMapSelector } from "../reducers/noteReducer";
import { MoveGroup } from "../controllers/groupController";
import PlainTextPasteHandler from "../lib/plaintextPaste";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export function GroupTree({ dragConstraint, group, offset = 0 }: { offset?: number, dragConstraint: RefObject<HTMLUListElement>, group: Group }) {
    const { isDragging, dragProps } = useDrag<HTMLLIElement>({ dragConstraint, onDrop })

    const { Confirm } = useConfirm()
    const navigate = useNavigate()
    const groups = useSelector(groupMapSelector)
    const notes = useSelector(noteMapSelector)
    const titleRef = useRef<HTMLParagraphElement>(null)
    const [title, setTitle] = useState<string>(group.title)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const dispatch: AppDispatch = useDispatch()

    function onDrop(target: Element, position: 'top' | 'middle' | 'bottom') {
        const targetId = target.getAttribute('data-item-id');
        if (target.getAttribute('data-group') && position == 'middle') {
            dispatch(updateGroupAsync({ id: group._id, group: { parentId: targetId } }));
            return
        }
        if (position == 'top' || position == 'bottom') {
            const mappedPosition = position == 'top' ? 'before' : 'after'
            dispatch(moveGroupAndMaybeRegroupAsync({ id: group._id, targetId, position: mappedPosition }))
        }
    }
    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.scrollLeft = 0;
        }
    }, [isEditing]);
    function HandleEdit(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        e.stopPropagation()

        titleRef.current.focus()
        setIsEditing(true)
    }
    function SetTitle(e: React.FormEvent<HTMLHeadingElement>): void {
        const newTitle = e.currentTarget.textContent ?? "";
        setTitle(newTitle);
        // stops newline from appearing when empty
        if (newTitle == "") {
            titleRef.current.innerText = ""
        }
    }
    function Cancel(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        e.stopPropagation()
        setIsEditing(false)
        setTitle(group.title)
    }
    function Save(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        e.stopPropagation()
        setIsEditing(false)
        dispatch(updateGroupAsync({ id: group._id, group: { title } }))
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
    const untitledNoteStyle = "after:inline after:font-light after:opacity-[0.6] after:italic after:content-['Untitled_Note...']"

    return (
        <li>
            <ul>
                <motion.li
                    drag
                    {...dragProps}
                    onClick={() => {
                        if (isEditing || isDragging.current) return
                        dispatch(updateGroupAsync({ group: { open: !group.open }, id: group._id }))
                    }}
                    data-item-id={group._id}
                    data-group
                    layout layoutId={group._id}
                    style={{ ...dragProps.style, paddingLeft: 0.5 + offset + "rem" }}
                    className={`hover:bg-bg-light bg-bg-dark hover:cursor-pointer transition-colors w-full max-w-full justify-between flex items-center  py-1 px-2 rounded-lg
                            ${isEditing && "bg-bg-light"} `}>
                    <div className="transition-[border,background-color] w-full justify-between overflow-x-hidden flex items-center gap-[8px]">
                        <FontAwesomeIcon className="text-white h-[20px]" icon={group.open ? faFolderOpen : faFolderClosed} />
                        <p
                            ref={titleRef}
                            onInput={SetTitle}
                            onPaste={PlainTextPasteHandler}
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            className={`outline-none rounded-md py-0.5 px-1 flex-1 overflow-x-hidden whitespace-nowrap text-ellipsis text-xs text-white 
                            ${title == "" && untitledNoteStyle} 
                            ${isEditing && "bg-bg-dark"}`}>{group.title}</p>

                        {isEditing ? <>
                            <FontAwesomeIcon
                                onClick={Save}
                                className="hover:text-green-400 text-white size-[16px]"
                                icon={faCheck} />
                            <FontAwesomeIcon
                                onClick={Cancel}
                                className="hover:text-red-400 text-white size-[16px]"
                                icon={faTimes} />
                        </> :
                            <>
                                <FontAwesomeIcon
                                    onClick={HandleEdit}
                                    className="hover:text-green-400 text-white size-[16px]"
                                    icon={faEdit} />
                                <FontAwesomeIcon
                                    onClick={HandleDelete}
                                    className="hover:text-red-400 text-white size-[16px]"
                                    icon={faTrashCan} />

                            </>

                        }
                    </div>
                </motion.li>
            </ul>
            <ul >
                {group.open ?
                    [...(group.children.map(id => ({ ...groups[id], type: "group" }))),
                    ...group.notes.map(id => ({ ...notes[id], type: "note" }))]
                        .sort((a, b) => a.position - b.position).map(item =>
                            item.type == "group" ?
                                <GroupTree
                                    key={item._id}
                                    offset={offset + 1}
                                    group={item as Group}
                                    dragConstraint={dragConstraint} />
                                :
                                <NoteDisplay
                                    key={item._id}
                                    offset={offset + 1}
                                    noteId={item._id}
                                    draggable={true}
                                    dragConstraint={dragConstraint}
                                />)

                    :
                    <></>}
            </ul>
        </li>
    );
}
