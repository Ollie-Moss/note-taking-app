import { useMotionValue } from "motion/react";
import { RefObject, useRef } from "react";

export function useDrag<T extends HTMLElement>({ dragConstraint, onDrop }: { onDrop: (targetId: string) => void, dragConstraint?: RefObject<HTMLUListElement> }) {

    // Drag state
    const y = useMotionValue(0);
    const isDragging = useRef<boolean>(false);
    const elementRef = useRef<T>(null)

    function handleDragStart(event: MouseEvent, info) {
        isDragging.current = true;
    }
    function handleDragging(event: MouseEvent, info) {
        isDragging.current = true;
    }
    function handleDragEnd(event: MouseEvent, info) {
        const currentElement = elementRef.current;

        const elemRect = currentElement.getBoundingClientRect();

        // Loop through all groups
        document.querySelectorAll("[data-parent-id]").forEach((dropTarget) => {
            const targetRect = dropTarget.getBoundingClientRect();

            const isOverlapping =
                elemRect.left < targetRect.right &&
                elemRect.right > targetRect.left &&
                elemRect.top < targetRect.bottom &&
                elemRect.bottom > targetRect.top;

            if (isOverlapping) {
                const targetId = dropTarget.getAttribute("data-parent-id");
                if (targetId) {
                    onDrop(targetId)
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
