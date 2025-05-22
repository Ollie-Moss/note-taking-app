import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useConfirm } from '../lib/confirmationProvider'
import { useNavigate } from "react-router";
import { Group } from "../models/group";
import { deleteGroupAndChildrenAsync, updateGroupAsync } from "../slices/groupSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import PlainTextPasteHandler from "../lib/plaintextPaste";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export default function GroupCardTitle({ group, isEditing, setIsEditing }: {
    group: Group,
    isEditing: boolean,
    setIsEditing: React.Dispatch<SetStateAction<boolean>>
}) {

    const [title, setTitle] = useState<string>(group.title)
    const dispatch: AppDispatch = useDispatch()
    const titleRef = useRef<HTMLParagraphElement>(null)
    const { Confirm } = useConfirm()
    const navigate = useNavigate()

    const untitledNoteStyle = "after:inline after:font-light after:opacity-[0.6] after:italic after:content-['Untitled_Group...']"

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

        dispatch(deleteGroupAndChildrenAsync(group._id))

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
        <>
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
                </>}

        </>
    )
}
