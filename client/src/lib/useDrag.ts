import { animate, useMotionValue } from "motion/react";
import React, { RefObject, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from "../store";
import { moveNoteAsync, noteMapSelector } from "../reducers/noteReducer";

export function useDrag<T, E extends HTMLElement>({
    index, items, setItems, dragConstraint, onDrop }:
    { index: number, items: T[], setItems: React.Dispatch<React.SetStateAction<T[]>>, onDrop: (dropTarget: Element, position: 'top' | 'middle' | 'bottom') => void, dragConstraint?: RefObject<HTMLUListElement> }) {

    // Drag state
    const y = useMotionValue(0);
    const isDragging = useRef<boolean>(false);
    const elementRef = useRef<E>(null)
    const dispatch: AppDispatch = useDispatch()
    const notes = useSelector(noteMapSelector)

    const bestTarget = useRef<Element | null>(null);
    const positionInTarget = useRef<'top' | 'middle' | 'bottom' | null>(null);
    const deadZone = 10;

    const maxOverlapArea = useRef<number>(0);

    function getNewIndex(currentIndex: number, pointerY: number) {
        const offset = Math.round((pointerY - currentIndex * itemHeight) / itemHeight);
        return Math.max(0, Math.min(items.length - 1, currentIndex + offset));
    }
    function handleDragStart(event: MouseEvent, info) {
        isDragging.current = true;
    }
    function handleDragging(event: MouseEvent, info) {
        isDragging.current = true;
        CalculateBestTarget()
        document.querySelectorAll("[data-item-id]").forEach((el) => {
            el.classList.remove("highlight-top-drop-target");
            el.classList.remove("highlight-drop-target")
            el.classList.remove("highlight-bottom-drop-target");
        });
        if (bestTarget.current && maxOverlapArea.current > 0) {
            switch (positionInTarget.current) {
                case 'top':
                    bestTarget.current.classList.add("highlight-top-drop-target");
                    break;
                case "middle":
                    bestTarget.current.classList.add("highlight-drop-target");
                    break;
                case "bottom":
                    bestTarget.current.classList.add("highlight-bottom-drop-target");
                    break;
            }
            const newIndex = getNewIndex(index, pointerY);
            if (newIndex !== index) {
                const reordered = [...items];
                const [moved] = reordered.splice(index, 1);
                reordered.splice(newIndex, 0, moved);
                setItems(reordered);
            }
        }
    }
    function handleDragEnd(event: MouseEvent, info) {
        const currentElement = elementRef.current;
        if (!currentElement) return;

        CalculateBestTarget()

        document.querySelectorAll("[data-item-id]").forEach((el) => {
            el.classList.remove("highlight-top-drop-target");
            el.classList.remove("highlight-drop-target")
            el.classList.remove("highlight-bottom-drop-target");
        });

        if (bestTarget.current && maxOverlapArea.current > 0) {
            onDrop(bestTarget.current, positionInTarget.current);
        }

        requestAnimationFrame(() => {
            y.stop()
            animate(y, 0, {
                type: "spring",
                stiffness: 500,
                damping: 30
            })
        });

        setTimeout(() => {
            isDragging.current = false;
        }, 0);
    }

    function CalculateBestTarget() {
        maxOverlapArea.current = 0;

        const currentElement = elementRef.current;
        if (!currentElement) return;

        const elemRect = currentElement.getBoundingClientRect();
        document.querySelectorAll("[data-item-id]").forEach((dropTarget) => {
            const targetRect = dropTarget.getBoundingClientRect();

            const overlapX = Math.max(0, Math.min(elemRect.right, targetRect.right) - Math.max(elemRect.left, targetRect.left));
            const overlapY = Math.max(0, Math.min(elemRect.bottom, targetRect.bottom) - Math.max(elemRect.top, targetRect.top));
            const overlapArea = overlapX * overlapY;

            if (overlapArea > maxOverlapArea.current && dropTarget != currentElement) {
                maxOverlapArea.current = overlapArea;
                bestTarget.current = dropTarget;

                // Determine whether the element is over the top or bottom half
                const draggedCenterY = (elemRect.top + elemRect.bottom) / 2;
                const targetCenterY = (targetRect.top + targetRect.bottom) / 2;

                const distanceFromCenter = draggedCenterY - targetCenterY;

                if (Math.abs(distanceFromCenter) <= deadZone) {
                    positionInTarget.current = 'middle';
                } else {
                    positionInTarget.current = distanceFromCenter < 0 ? 'top' : 'bottom';
                }
            }
        });
    }

    return {
        isDragging,
        dragProps: {
            dragElastic: 0,
            style: { y },
            dragConstraints: dragConstraint,
            onDragEnd: handleDragEnd,
            onDragStart: handleDragStart,
            onDrag: handleDragging,
            dragMomentum: false,
            ref: elementRef
        }
    }
}
