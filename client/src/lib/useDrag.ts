import { useMotionValue } from "motion/react";
import { RefObject, useRef } from "react";

export function useDrag<T extends HTMLElement>({ dragConstraint, onDrop }: { onDrop: (dropTarget: Element, position: 'top' | 'middle' | 'bottom') => void, dragConstraint?: RefObject<HTMLUListElement> }) {

    // Drag state
    const y = useMotionValue(0);
    const isDragging = useRef<boolean>(false);
    const elementRef = useRef<T>(null)

    const bestTarget = useRef<Element | null>(null);
    const positionInTarget = useRef<'top' | 'middle' | 'bottom' | null>(null);
    const deadZone = 10;

    const maxOverlapArea = useRef<number>(0);

    function handleDragStart(event: MouseEvent, info) {
        isDragging.current = true;
    }
    function handleDragging(event: MouseEvent, info) {
        isDragging.current = true;
        CalculateBestTarget()
        document.querySelectorAll("[data-item-id]").forEach((el) =>
            el.classList.remove("highlight-drop-target")
        );
        if (bestTarget.current && maxOverlapArea.current > 0) {
            bestTarget.current.classList.add("highlight-drop-target");
        }
    }
    function handleDragEnd(event: MouseEvent, info) {
        const currentElement = elementRef.current;
        if (!currentElement) return;

        CalculateBestTarget()
        // Remove highlights from all drop targets
        document.querySelectorAll("[data-item-id]").forEach((el) =>
            el.classList.remove("highlight-drop-target")
        );

        if (bestTarget.current && maxOverlapArea.current > 0) {
            onDrop(bestTarget.current, positionInTarget.current);
        }

        requestAnimationFrame(() => {
            y.set(0);
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
