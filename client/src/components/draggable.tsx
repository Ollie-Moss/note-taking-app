import { HTMLMotionProps, motion, PanInfo, useMotionValue } from "motion/react";
import { useRef } from "react";

// Ensures that dragConstraints is required & onDrop is set to the custom prop
type RequiredDragConstraints = Required<Pick<HTMLMotionProps<"div">, "dragConstraints">>;
type HTMLMotionDivProps = Omit<HTMLMotionProps<"div">, "dragConstraints" | "onDrop"> & RequiredDragConstraints;

export default function Draggable({ onDrop, isdragging: isDragging, children, ...rest }: { isdragging: React.RefObject<boolean>, onDrop: (dropTarget: Element, position: 'top' | 'middle' | 'bottom') => void } & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> & HTMLMotionDivProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const elementRef = useRef<HTMLDivElement>(null)

    const bestTarget = useRef<Element | null>(null);
    const positionInTarget = useRef<'top' | 'middle' | 'bottom' | null>(null);

    // Detirmines how big "middle" of the drop target is in px
    const deadZone = 7;
    // Detirmines the extra distance required to switch from "middle" to "top" or "bottom"
    // Fixes weird flickering when hovering around the border
    // between "middle" and "top" or "bottom"
    const positionChangePadding = 2;

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

        if (validTarget) {
            bestTarget.current = validTarget;

            const targetRect = validTarget.getBoundingClientRect();
            const centerY = (targetRect.top + targetRect.bottom) / 2;
            const distance = info.point.y - centerY;

            if (Math.abs(distance) < deadZone) {
                positionInTarget.current = 'middle';
            } else {
                // If previous position is "middle" add padding
                if (positionInTarget.current === 'middle') {
                    if (distance < -deadZone - positionChangePadding) {
                        positionInTarget.current = 'top';
                    } else if (distance > deadZone + positionChangePadding) {
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

    return (
        <motion.div
            {...rest}
            dragElastic={0}
            dragMomentum={false}
            style={{ ...rest.style, x, y }}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDrag={handleDragging}
            ref={elementRef}
        >
            {children}
        </motion.div >
    )
}
