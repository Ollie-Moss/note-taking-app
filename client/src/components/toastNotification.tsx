import { faCheck, faInfo, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Toast, useToast } from "../lib/toastProvider"
import { useEffect, useRef } from "react"


export default function ToastNotification({ toast }: { toast: Toast }) {
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

    function FadeOut() {
        if (!toastRef.current) return;
        toastRef.current.style.animation = `fadeAndSquash 0.4s ease-out forwards`
        toastRef.current.onanimationend = () => closeToast(toast);
    }

    useEffect(() => {
        setTimeout(() => {
            FadeOut();
        }, toast.length ?? 2000)
    }, [FadeOut])

    return (
        <div
            ref={toastRef}
            style={{ borderLeftColor: colorMap[toast.type], transformOrigin: "top" }}
            className={`flex gap-[20px] border-l-[10px] bg-white px-4 py-2 rounded shadow-md text-bg-dark`}>
            <div className="flex flex-col justify-center">
                <FontAwesomeIcon style={{ backgroundColor: colorMap[toast.type] }} className="p-[10px] w-[20px] h-[20px] text-white rounded-full" icon={iconMap[toast.type]} />
            </div>
            <div className="flex flex-col gap-1">
                <h2 className="capitalize font-bold text-base">{toast.type}</h2>
                <p className="pb-1"> {toast.message} </p>
            </div>
            <FontAwesomeIcon
                onClick={FadeOut}
                className="pt-1" icon={faTimes} />
        </div >
    )
}
