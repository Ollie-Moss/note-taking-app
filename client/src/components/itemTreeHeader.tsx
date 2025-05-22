import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./dropdown";
import { useDispatch } from 'react-redux'
import { createGroupAsync } from "../slices/groupSlice";
import { AppDispatch } from "../store";
import { createNoteAsync } from "../slices/noteSlice";

export default function ItemTreeHeader() {
    const dispatch: AppDispatch = useDispatch();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDropdown = () => setIsOpen(prev => !prev);
    return (
        <li className="flex items-center justify-between">
            <p className="text-m text-white">Notes</p>
            <div>
                <FontAwesomeIcon
                    onClick={toggleDropdown}
                    className="hover:cursor-pointer text-white pr-2"
                    icon={faPlus}
                />
                <Dropdown
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    options={[
                        {
                            title: "Create Note",
                            onclick: () => dispatch(createNoteAsync())
                        },
                        {
                            title: "Create Group",
                            onclick: () => dispatch(createGroupAsync())
                        }
                    ]}
                />
            </div>
        </li>
    )
}
