import { animate, PanInfo, useDragControls, useMotionValue } from "motion/react";
import React, { RefObject, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from "../store";
import { moveNoteAsync, noteMapSelector } from "../reducers/noteReducer";

export function useDrag<E extends HTMLElement>({
    dragConstraint, onDrop }:
    { onDrop: (dropTarget: Element, position: 'top' | 'middle' | 'bottom') => void, dragConstraint?: RefObject<HTMLUListElement> }) {

    const dragControls = useDragControls()
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const isDragging = useRef<boolean>(false);
    const elementRef = useRef<E>(null)

    const bestTarget = useRef<Element | null>(null);
    const positionInTarget = useRef<'top' | 'middle' | 'bottom' | null>(null);
    const deadZone = 7;

    const maxOverlapArea = useRef<number>(0);

    function handleDragStart(event: MouseEvent, info: PanInfo) {
        isDragging.current = true;
    }
    function handleDragging(event: MouseEvent, info: PanInfo) {
        isDragging.current = true;
        CalculateBestTarget(info)
        document.querySelectorAll("[data-item-id]").forEach((el) => {
            el.classList.remove("highlight-top-drop-target");
            el.classList.remove("highlight-drop-target")
            el.classList.remove("highlight-bottom-drop-target");
        });
        if (bestTarget.current) {
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
        }
        y.set(0)
        x.set(0)
    }
    function handleDragEnd(event: MouseEvent, info) {
        const currentElement = elementRef.current;
        if (!currentElement) return;

        document.querySelectorAll("[data-item-id]").forEach((el) => {
            el.classList.remove("highlight-top-drop-target");
            el.classList.remove("highlight-drop-target")
            el.classList.remove("highlight-bottom-drop-target");
        });

        if (bestTarget.current) {
            onDrop(bestTarget.current, positionInTarget.current);
        }

        setTimeout(() => {
            isDragging.current = false;
        }, 0);
    }

    function CalculateBestTarget(info: PanInfo) {
        const currentElement = elementRef.current;
        if (!currentElement) return;

        const elementsUnderPointer = document.elementsFromPoint(info.point.x, info.point.y);

        const validTarget = elementsUnderPointer.find((el) => {
            if (el === currentElement) return false;
            return el.hasAttribute("data-item-id");
        });

        const hysteresis = 2; // You can tweak this value
        if (validTarget) {
            bestTarget.current = validTarget;

            const targetRect = validTarget.getBoundingClientRect();
            const centerY = (targetRect.top + targetRect.bottom) / 2;
            const distance = info.point.y - centerY;

            if (Math.abs(distance) < deadZone) {
                positionInTarget.current = 'middle';
            } else {
                // Hysteresis logic
                if (positionInTarget.current === 'middle') {
                    if (distance < -deadZone - hysteresis) {
                        positionInTarget.current = 'top';
                    } else if (distance > deadZone + hysteresis) {
                        positionInTarget.current = 'bottom';
                    }
                } else {
                    positionInTarget.current = distance < 0 ? 'top' : 'bottom';
                }
            }
        } else {
            bestTarget.current = null;
            positionInTarget.current = null;
        }
    }

    return {
        dragControls,
        isDragging,
        dragProps: {
            dragControls: dragControls,
            dragElastic: 0,
            dragMomentum: false,
            style: { x, y },
            dragConstraints: dragConstraint,
            onDragEnd: handleDragEnd,
            onDragStart: handleDragStart,
            onDrag: handleDragging,
            ref: elementRef,
        }
    }
}
