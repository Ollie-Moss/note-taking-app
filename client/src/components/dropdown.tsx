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
                className="absolute z-10 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                    {options.map(option => (
                        <button
                            key={option.title}
                            onClick={option.onclick}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" >
                            {option.title}
                        </button>
                    ))}
                </div>
            </div >
        )
    )
}
