import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faMagnifyingGlass, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { NoteDisplay } from "./noteDisplay";
import { useSearch } from "../lib/searchProvider";
import { GroupTree } from "./groupTree";
import { useRef, useState } from "react";
import Dropdown from "./dropdown";
import { useDispatch, useSelector } from 'react-redux'
import { createGroupAsync, groupArraySelector, rootGroupSelector } from "../reducers/groupReducer";
import { AppDispatch } from "../store";
import { createNoteAsync, ungroupedNotesSelector } from "../reducers/noteReducer";
import { AnimatePresence } from "motion/react";
import { Group } from "../models/group";


export default function Sidebar() {
    const { OpenSearch } = useSearch()
    const dispatch: AppDispatch = useDispatch();

    const groups = useSelector(rootGroupSelector)
    const notes = useSelector(ungroupedNotesSelector)

    const listRef = useRef(null)

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDropdown = () => setIsOpen(prev => !prev);

    return (
        <aside className="bg-bg-dark h-full w-0 lg:w-[220px] lg:max-w-[220px] flex flex-col lg:px-[20px]">
            <UserProfile />
            <ul className="mt-[20%]">
                <NavLink
                    title={"Home"}
                    icon={faHouse}
                    to={"/notes/home"}
                />
                <li
                    onClick={OpenSearch}
                    className="transition hover:cursor-pointer flex gap-[20px] items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                    <FontAwesomeIcon className="text-white size-[20px]" icon={faMagnifyingGlass} />
                    <p className="text-sm text-white">Search</p>
                </li >
            </ul>
            <ul ref={listRef} className="mt-[50%]">
                <li className="flex items-center justify-between">
                    <p className="text-m text-white">Notes</p>
                    <div>
                        <FontAwesomeIcon
                            onClick={toggleDropdown}
                            className="hover:cursor-pointer text-white pr-2"
                            icon={faPlus} >
                        </FontAwesomeIcon>
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
                            ]
                            } />
                    </div>
                </li>
                <AnimatePresence mode="wait">
                    <ul>
                        {
                            [...(groups.map(group => ({ ...group, type: "group" }))),
                            ...notes.map(note => ({ ...note, type: "note" }))]
                                .sort((a, b) => a.position - b.position).map(item =>
                                    item.type == "group" ?
                                        < GroupTree
                                            key={item._id}
                                            group={item as Group}
                                            dragConstraint={listRef} />
                                        :
                                        <NoteDisplay
                                            key={item._id}
                                            noteId={item._id}
                                            draggable={true}
                                            dragConstraint={listRef}
                                        />)
                        }
                    </ul>
                </AnimatePresence>
            </ul>

        </aside>
    )
}


function NavLink({ title, icon, to, search }: { title: string, icon: IconDefinition, to?: string, search?: string }) {
    return (

        <Link
            to={{
                pathname: to,
                search: search
            }} >
            <li className="transition flex gap-[20px] items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                <FontAwesomeIcon className="text-white size-[20px]" icon={icon} />
                {title == "" ?
                    <p className="text-sm text-white opacity-[0.6] italic">Untitled Note</p>
                    :
                    <p className="text-sm text-white">{title}</p>
                }
            </li >
        </Link>
    )
}

function UserProfile() {
    // fetch user data
    return (
        <div className="flex items-center gap-1 py-[20px]">
            <img className="w-[38px] h-[38px] rounded-[4px] " src="public/profile_pic.png" />
            <p className="font-medium text-base text-white"> Name </p>
        </div>
    )
}
