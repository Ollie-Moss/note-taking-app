import { HTMLMotionProps, motion, PanInfo, useMotionValue } from "motion/react";
import { useRef } from "react";

// Ensures that dragConstraints is required & onDrop is set to the custom prop
type RequiredDragConstraints = Required<Pick<HTMLMotionProps<"div">, "dragConstraints">>;
type HTMLMotionDivProps = Omit<HTMLMotionProps<"div">, "dragConstraints" | "onDrop"> & RequiredDragConstraints;

// Wrapper component
// Makes children draggable but dont visibly move
// Custom onDrop method can be provided
// Only counts elements with data-item-id as drop targets
// Applies style to currently hovered drop target
export default function Draggable({ onDrop, isdragging: isDragging, children, ...rest }: { isdragging: React.RefObject<boolean>, onDrop: (dropTarget: Element, position: 'top' | 'middle' | 'bottom') => void } & Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> & HTMLMotionDivProps) {
    // x and y values to force element to be stationary
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // The draggable element used to ensure that elements cannot be dropped on themselves
    const elementRef = useRef<HTMLDivElement>(null)

    // Current best drop target and the position at which it is being hovered
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

    // Clears and reapplies drop target styles
    function handleDragging(event: MouseEvent, info: PanInfo) {
        isDragging.current = true;
        CalculateBestTarget(info)

        // remove styles
        document.querySelectorAll("[data-item-id]").forEach((el) => {
            el.classList.remove("highlight-top-drop-target");
            el.classList.remove("highlight-drop-target")
            el.classList.remove("highlight-bottom-drop-target");
        });
        // apply new styles
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
        // ensure that x and y are locked
        y.set(0)
        x.set(0)
    }

    // Clears drop styles and calls custom on drop function
    function handleDragEnd(event: MouseEvent, info) {
        const currentElement = elementRef.current;
        if (!currentElement) return;

        // clear drop target styles
        document.querySelectorAll("[data-item-id]").forEach((el) => {
            el.classList.remove("highlight-top-drop-target");
            el.classList.remove("highlight-drop-target")
            el.classList.remove("highlight-bottom-drop-target");
        });

        // custom drop method
        if (bestTarget.current) {
            onDrop(bestTarget.current, positionInTarget.current);
        }

        // ensures that onclicks are not called as soon as
        // dragging ends
        setTimeout(() => {
            isDragging.current = false;
        }, 0);
    }

    // Calculates the best drop target based on mouse position
    // Updates bestDropTarget and positionInTarget refs
    function CalculateBestTarget(info: PanInfo) {
        const currentElement = elementRef.current;
        if (!currentElement) return;

    // gets all elements underneath cursor
        const elementsUnderPointer = document.elementsFromPoint(info.point.x, info.point.y);

        // finds the first element with the data-item-id attribute
        const validTarget = elementsUnderPointer.find((el) => {
            if (el === currentElement) return false;
            return el.hasAttribute("data-item-id");
        });

        // if a drop target is found
        if (validTarget) {
            // update current target
            bestTarget.current = validTarget;

            // find center of target and distance to center
            const targetRect = validTarget.getBoundingClientRect();
            const centerY = (targetRect.top + targetRect.bottom) / 2;
            const distance = info.point.y - centerY;

            // if distance on either side is less than the deadzone
            // set to middle
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
                    // otherwise just calculate top or bottom
                    // based on whether distance is positive
                    // or negative
                    positionInTarget.current = distance < 0 ? 'top' : 'bottom';
                }
            }
        } else {
            // if no target was found 
            // set refs to null
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
