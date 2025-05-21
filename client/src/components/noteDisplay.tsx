import { useLocation, useNavigate } from "react-router";
import { useConfirm } from "../lib/confirmationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faFile, faStar as fasStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { twMerge } from 'tailwind-merge'
import { motion, useMotionValue } from 'motion/react'
import React, { RefObject, useMemo, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAsync, moveNoteAndMaybeRegroupAsync, moveNoteAsync, noteMapSelector, updateNoteAsync } from "../reducers/noteReducer";
import { AppDispatch } from "../store";
import { useDrag } from "../lib/useDrag";
import { useSidebar } from "../lib/sidebarProvider";


export function NoteDisplay({ noteId, className, onClick, dragConstraint, draggable, offset = 0 }: { offset?: number, dragConstraint?: RefObject<HTMLUListElement>, noteId: string, className?: string, onClick?: () => void, draggable?: boolean }) {
    const { dragControls, isDragging, dragProps } = useDrag<HTMLLIElement>({ dragConstraint, onDrop })

    const doubleClickDelay = 400;
    const doubleClickTimeout = useRef<number | null>(null)

    // Note State
    const notes = useSelector(noteMapSelector)
    const note = useMemo(() => notes[noteId], [noteId, notes])
    const dispatch: AppDispatch = useDispatch();

    // navigation
    const location = useLocation()
    const navigate = useNavigate();


    // Helper
    const { Confirm } = useConfirm()

    const { setSideBar } = useSidebar();

    function onDrop(target: Element, position: 'top' | 'middle' | 'bottom') {
        const targetId = target.getAttribute('data-item-id');
        if (target.getAttribute('data-group') && position == 'middle') {
            dispatch(updateNoteAsync({ id: noteId, note: { parentId: targetId } }));
            return
        }
        if (position == 'top' || position == 'bottom') {
            const mappedPosition = position == 'top' ? 'before' : 'after'
            dispatch(moveNoteAndMaybeRegroupAsync({ id: noteId, targetId, position: mappedPosition }))
        }
    }

    async function HandleFavourite(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault()
        e.stopPropagation()
        dispatch(updateNoteAsync({ id: noteId, note: { favourite: !note.favourite } }));
    }


    async function HandleDelete(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        e.stopPropagation()
        const confirmed = await Confirm("Are you sure you wish to delete this note?");
        if (confirmed) {
            dispatch(deleteNoteAsync(note._id));
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
        if (!window.matchMedia('(min-width: 1024px)').matches) {
            setSideBar(false)
        }

    }

    if (!note) return
    return (
        <motion.li
            {...(draggable ? {
                drag: true,
                layout: true,
                layoutId: noteId
            } : {})}
            {...dragProps}
            onPointerDown={(e) => {
                if (doubleClickTimeout.current) {
                    clearTimeout(doubleClickTimeout.current)
                    doubleClickTimeout.current = null
                    dragControls.start(e)
                    return
                }
                doubleClickTimeout.current = setTimeout(() => {
                    if (!isDragging.current) {
                        onClick ? onClick() : defaultOnClick(e)
                    }
                    doubleClickTimeout.current = null
                }, doubleClickDelay)
            }}
            data-item-id={noteId}
            style={{ ...dragProps.style, paddingLeft: 0.5 + offset + "rem" }}
            className={
                twMerge(
                    "bg-bg-dark transition-[border,background-color] hover:cursor-pointer w-full max-w-full justify-between flex items-center hover:bg-bg-light py-1.5 px-2 rounded-lg",
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
                    onPointerDown={HandleFavourite}
                    icon={note.favourite ? fasStar : farStar} />
                <FontAwesomeIcon
                    onPointerDown={HandleDelete}
                    className="hover:text-red-400 text-white size-[16px]"
                    icon={faTrashCan} />
            </div>
        </motion.li >
    )
}
