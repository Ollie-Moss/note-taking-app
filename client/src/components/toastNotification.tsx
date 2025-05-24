import { faCheck, faInfo, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Toast, useToast } from "../lib/toastProvider"
import { useEffect, useRef } from "react"

// Toast notification 
// Auto-fade (2000ms by default)
// Manual close
export default function ToastNotification({ toast }: { toast: Toast }) {
    // Map toast types to icons and colors
    const iconMap = {
        "success": faCheck,
        "error": faTimes,
        "info": faInfo
    }
    const colorMap = {
        "success": "var(--green)",
        "error": "var(--red)",
        "info": "var(--blue)"
    }

    const { closeToast } = useToast()
    const toastRef = useRef<HTMLDivElement>(null)

    // Starts fade-out animation and closes toast after animation ends
    function FadeOut() {
        if (!toastRef.current) return;
        toastRef.current.style.animation = `fadeAndSquash 0.4s ease-out forwards`
        toastRef.current.onanimationend = () => closeToast(toast);
    }

    // Automatically fade out toast after duration 2000ms by default
    useEffect(() => {
        const timeout = setTimeout(() => {
            FadeOut();
        }, toast.length ?? 2000)
        return () => clearTimeout(timeout);
    }, [toast.length, FadeOut])

    return (
        /* Left border coloured based on toast type */
        <div
            ref={toastRef}
            style={{ borderLeftColor: colorMap[toast.type], transformOrigin: "top" }}
            className={`flex gap-[20px] border-l-[10px] px-4 py-2 rounded shadow-md text-white bg-bg-dark`}>
            {/* Icon with background colour based on toast type */}
            <div className="flex flex-col justify-center">
                <FontAwesomeIcon style={{ backgroundColor: colorMap[toast.type] }} className="p-[10px] w-[20px] h-[20px] text-white rounded-full" icon={iconMap[toast.type]} />
            </div>
            {/* Message content */}
            <div className="flex flex-col gap-1">
                <h2 className="capitalize font-bold text-base">{toast.type}</h2>
                <p className="pb-1"> {toast.message} </p>
            </div>
            {/* Close button */}
            <FontAwesomeIcon
                onClick={FadeOut}
                className="pt-1" icon={faTimes} />
        </div >
    )
}
