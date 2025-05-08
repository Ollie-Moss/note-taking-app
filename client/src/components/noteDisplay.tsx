import { useLocation, useNavigate } from "react-router";
import { useNotes } from "../lib/noteContext";
import { Note } from "../models/note";
import { useConfirm } from "../lib/confirmationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faStar as fasStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { twMerge } from 'tailwind-merge'

export function NoteDisplay({ note, className, onClick }: { note: Note, className?: string, onClick?: () => void }) {
    const { deleteNote, updateNote } = useNotes();
    const navigate = useNavigate();
    const { Confirm } = useConfirm()
    const location = useLocation()

    async function HandleFavourite(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault()
        e.stopPropagation()
        updateNote({ ...note, favourite: !note.favourite });
    }

    async function HandleDelete(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        e.stopPropagation()
        const confirmed = await Confirm("Are you sure you wish to delete this note?");
        if (confirmed) {
            deleteNote(note._id);
            const params = new URLSearchParams(location.search)
            if (location.pathname == "/notes" && params.has("id", note._id)) {
                navigate({
                    pathname: "/notes", search: ""
                })
            }
        }
    }

    function defaultOnClick(e: React.MouseEvent<HTMLLIElement>) {
        e.preventDefault()
        navigate({
            pathname: "/notes",
            search: `?id=${note._id}`
        })
    }

    return (
        <li
            onClick={onClick ?? defaultOnClick}
            className={
                twMerge([
                    ..."hover:cursor-pointer transition w-full max-w-full justify-between flex items-center hover:bg-bg-light py-1.5 px-2 rounded-lg".split(" "),
                    ...(className ? className.split(" ") : [])
                ])}>
            <div className="justify-between overflow-x-hidden flex items-center gap-[8px]">
                <FontAwesomeIcon className="text-white size-[20px]" icon={faFile} />
                <p className={`flex-1 overflow-x-hidden whitespace-nowrap text-ellipsis text-xs text-white 
                                ${note.title == "" ? "opacity-[0.6] italic" : ""}`}>
                    {note.title == "" ?
                        "Untitled Note"
                        :
                        note.title
                    }</p>
            </div>
            <div className="flex gap-1 items-center justify-between">
                <FontAwesomeIcon
                    className="hover:text-yellow-500 fa-regular text-white size-[16px]"
                    onClick={HandleFavourite}
                    icon={note.favourite ? fasStar : farStar} />
                <FontAwesomeIcon
                    onClick={HandleDelete}
                    className="hover:text-red-400 text-white size-[16px]"
                    icon={faTimes} />
            </div>
        </li >
    )
}
