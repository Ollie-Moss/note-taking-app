import { useLocation, useNavigate } from "react-router";
import { Note } from "../models/note";
import { useConfirm } from "../lib/confirmationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faStar as fasStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { twMerge } from 'tailwind-merge'
import { useNote, useNotes } from "../lib/noteProvider";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotionConfig, useSpring } from 'motion/react'
import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";


export function NoteDisplay({ noteId, className, onClick, dragConstraint, draggable, offset = 0 }: { offset?: number, dragConstraint?: RefObject<HTMLUListElement>, noteId: string, className?: string, onClick?: () => void, draggable?: boolean }) {
    const { note, deleteNote, updateNote } = useNote(noteId);
    const y = useMotionValue(0);
    const isDragging = useRef<boolean>(false);

    const navigate = useNavigate();
    const { Confirm } = useConfirm()
    const location = useLocation()
    const noteElementRef = useRef<HTMLLIElement>(null)

    async function HandleFavourite(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault()
        e.stopPropagation()
        updateNote(noteId, { favourite: !note.favourite });
    }

    function handleDragStart(event: MouseEvent, info) {
        isDragging.current = true;
    }
    function handleDragging(event: MouseEvent, info) {
        isDragging.current = true;
    }
    function handleDragEnd(event: MouseEvent, info) {
        const noteElement = noteElementRef.current;

        const noteRect = noteElement.getBoundingClientRect();

        // Loop through all groups
        document.querySelectorAll("[data-group-id]").forEach((groupEl) => {
            const groupRect = groupEl.getBoundingClientRect();

            const isOverlapping =
                noteRect.left < groupRect.right &&
                noteRect.right > groupRect.left &&
                noteRect.top < groupRect.bottom &&
                noteRect.bottom > groupRect.top;

            if (isOverlapping) {
                const groupId = groupEl.getAttribute("data-group-id");
                if (groupId) {
                    updateNote(noteId, { parentId: groupId });
                }
            }
        });
        requestAnimationFrame(() => {
            y.set(0)
        })
        setTimeout(() => {
            // Delay to allow click to be triggered before reset
            isDragging.current = false;
        }, 0);
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
                    pathname: "/notes/home", search: ""
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

    if (!note) return
    return (
        <motion.li
            {...(draggable ? { drag: "y" } : {})}
            dragElastic={0}
            dragConstraints={dragConstraint}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDrag={handleDragging}
            dragMomentum={false}
            onClick={(e) => {
                if (!isDragging.current) {
                    onClick ? onClick() : defaultOnClick(e)
                }
            }}
            style={{ y, paddingLeft: 0.5 + offset + "rem" }}
            ref={noteElementRef}
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
