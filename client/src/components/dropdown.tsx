import { SetStateAction, useEffect, useRef } from "react";

export default function Dropdown({ isOpen, setIsOpen, options }:
    {
        isOpen: boolean,
        setIsOpen: React.Dispatch<SetStateAction<boolean>>,
        options: { title: string, onclick: () => void }[]
    }) {

    const dropdownRef = useRef(null);
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        isOpen && (
            <div ref={dropdownRef}
                className="absolute z-10 flex flex-col  w-44 rounded-md ring ring-hl text-white bg-bg-light">
                <div >
                    {options.map(option => (
                        <button
                            key={option.title}
                            onClick={() => { option.onclick(); setIsOpen(false) }}
                            className="rounded-md bg-bg-light w-full text-left px-4 py-2 text-sm hover:bg-hl" >
                            {option.title}
                        </button>
                    ))}
                </div>
            </div >
        )
    )
}
