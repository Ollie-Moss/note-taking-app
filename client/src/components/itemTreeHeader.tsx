import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./dropdown";
import { useDispatch } from 'react-redux'
import { createGroupAsync } from "../slices/groupSlice";
import { AppDispatch } from "../store";
import { createNoteAsync } from "../slices/noteSlice";

// Header section for the item tree which includes
// Title label
// A dropdown menu for creating new notes or groups
export default function ItemTreeHeader() {
    // Typed dispatch for async actions
    const dispatch: AppDispatch = useDispatch();
    // Dropdown visibility state
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // Toggles the dropdown menu open/closed
    const toggleDropdown = () => setIsOpen(prev => !prev);

    return (
        <li className="flex items-center justify-between">
            {/* Section label */}
            <p className="text-m text-white">Notes</p>

            <div>
                {/* Add button that toggles dropdown */}
                <FontAwesomeIcon
                    onClick={toggleDropdown}
                    className="hover:cursor-pointer text-white pr-2"
                    icon={faPlus}
                />
                {/* Dropdown with two add note and group options */}
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
