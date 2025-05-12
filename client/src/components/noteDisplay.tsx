import { useLocation, useNavigate } from "react-router";
import { Note } from "../models/note";
import { useConfirm } from "../lib/confirmationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faStar as fasStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { twMerge } from 'tailwind-merge'
import { useNote, useNotes } from "../lib/noteProvider";
import { motion } from 'motion/react'
import React, { RefObject, useMemo, useState } from "react";


export function NoteDisplay({ noteId, className, onClick, dragConstraint, draggable, offset = 0 }: { offset?: number, dragConstraint?: RefObject<HTMLUListElement>, noteId: string, className?: string, onClick?: () => void, draggable?: boolean }) {
    const { note, deleteNote, updateNote } = useNote(noteId);

    const navigate = useNavigate();
    const { Confirm } = useConfirm()
    const location = useLocation()

    async function HandleFavourite(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault()
        e.stopPropagation()
        updateNote({ ...note, favourite: !note.favourite } as Note);
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
        <motion.li
            {...(draggable ? { drag: true } : {})}
            dragElastic={0}
            dragConstraints={dragConstraint}
            dragMomentum={false}
            onClick={onClick ?? defaultOnClick}
            style={{ paddingLeft: offset + "rem" }}
            className={
                twMerge(
                    "bg-bg-dark hover:cursor-pointer transition-colors w-full max-w-full justify-between flex items-center hover:bg-bg-light py-1.5 px-2 rounded-lg",
                    className
                )}>
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
        </motion.li >
    )
}
