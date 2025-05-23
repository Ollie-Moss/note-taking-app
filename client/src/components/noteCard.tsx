import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from 'tailwind-merge'
import { useDragControls } from 'motion/react'
import React, { RefObject, useEffect, useMemo, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAsync, moveNoteAndMaybeRegroupAsync, updateNoteAsync } from "../slices/noteSlice";
import { noteMapSelector } from "../selectors/noteSelectors";
import { AppDispatch } from "../store";
import { useSidebar } from "../lib/sidebarProvider";
import { createOnDrop } from "../lib/createOnDropHandler";
import Draggable from "./draggable";
import NoteCardButtons from "./noteCardButtons";


export function NoteCard({ noteId, className, onClick, dragConstraint, draggable, offset = 0 }: { offset?: number, dragConstraint?: RefObject<HTMLUListElement>, noteId: string, className?: string, onClick?: () => void, draggable?: boolean }) {
    // Drop behaviour
    // Updates the displayed note 
    const onDrop = createOnDrop({
        update: (updates) => dispatch(updateNoteAsync({ id: noteId, note: updates })),
        move: (targetId, position) => dispatch(moveNoteAndMaybeRegroupAsync({ id: noteId, targetId, position }))
    })

    // Double click state
    const doubleClickDelay = 300;
    const timeStart = useRef<number>(0);
    const pointerDownTimeout = useRef<number | null>(null)
    const canClick = useRef<boolean>(false)

    // Note State
    const notes = useSelector(noteMapSelector)
    const note = useMemo(() => notes[noteId], [noteId, notes])
    const dispatch: AppDispatch = useDispatch();

    // Navigation
    const navigate = useNavigate();

    // Drag state
    const isDragging = useRef<boolean>(false);
    const dragControls = useDragControls();

    // Helpers
    const { closeSidebarIfMobile } = useSidebar();

    // Default behaviour navigates to note that is being displayed
    function defaultOnClick(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault()
        navigate({
            pathname: "/notes",
            search: `?id=${note._id}`
        })
        closeSidebarIfMobile()
    }

    function HandlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (!e.currentTarget.contains(e.target as Element)) return
        if (!pointerDownTimeout.current && canClick.current && !isDragging.current) {
            onClick ? onClick() : defaultOnClick(e)
            canClick.current = false
            return
        }
        if (pointerDownTimeout.current) {
            clearTimeout(pointerDownTimeout.current)
            const timeLeft = Math.max(doubleClickDelay - (Date.now() - timeStart.current), 0);
            pointerDownTimeout.current = setTimeout(() => {
                if (!isDragging.current) {
                    onClick ? onClick() : defaultOnClick(e)
                }
                pointerDownTimeout.current = null
                canClick.current = false
            }, timeLeft)
        }
    }

    function HandlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (!e.currentTarget.contains(e.target as Element)) return
        if (pointerDownTimeout.current) {
            clearTimeout(pointerDownTimeout.current)
            pointerDownTimeout.current = null
            canClick.current = false
            dragControls.start(e)
            return
        }
        timeStart.current = Date.now()
        pointerDownTimeout.current = setTimeout(() => {
            canClick.current = true;
            pointerDownTimeout.current = null
        }, doubleClickDelay)
    }

    useEffect(() => {
        pointerDownTimeout.current = null
        clearTimeout(pointerDownTimeout.current)
        canClick.current = false
    }, [])

    if (!note) return
    return (
        <Draggable
            /* Drag properties */
            /* If draggable set layout for auto animation */
            {...(draggable ? {
                drag: true,
                layout: true,
                layoutId: noteId
            } : {})}
            dragConstraints={dragConstraint}
            dragControls={dragControls}
            isdragging={isDragging}
            /* Drop target properties */
            data-item-id={noteId}
            /* Events */
            onDrop={onDrop}
            onPointerDown={HandlePointerDown}
            onPointerUp={HandlePointerUp}
            /* Styles */
            style={{ paddingLeft: 0.5 + offset + "rem" }}
            className={twMerge("bg-bg-dark transition-[border,background-color] hover:cursor-pointer w-full max-w-full justify-between flex items-center hover:bg-bg-light py-1.5 px-2 rounded-lg",
                className)}>
            {/* Main content */}
            <div className="justify-between overflow-x-hidden flex items-center gap-[8px]">
                <FontAwesomeIcon className="text-white size-[20px]" icon={faFile} />
                <p className={`flex-1 overflow-x-hidden whitespace-nowrap text-ellipsis text-xs text-white 
                                ${note.title == "" ? "opacity-[0.6] italic" : ""}`}>
                    {note.title == "" ?
                        "Untitled Note"
                        :
                        note.title}
                </p>
            </div>
            <NoteCardButtons note={note} />
        </Draggable >
    )
}

