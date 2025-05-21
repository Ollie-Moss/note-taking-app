import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faBars, faHamburger, faMagnifyingGlass, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { NoteDisplay } from "./noteDisplay";
import { useSearch } from "../lib/searchProvider";
import { GroupTree } from "./groupTree";
import { useRef, useState } from "react";
import Dropdown from "./dropdown";
import { useDispatch, useSelector } from 'react-redux'
import { createGroupAsync, groupArraySelector, rootGroupSelector } from "../reducers/groupReducer";
import { AppDispatch } from "../store";
import { createNoteAsync, ungroupedNotesSelector } from "../reducers/noteReducer";
import { AnimatePresence, motion } from "motion/react";
import { Group } from "../models/group";
import { useSidebar } from "../lib/sidebarProvider";

export default function Sidebar() {
    const { isSidebarOpen, setSideBar } = useSidebar()
    const { OpenSearch } = useSearch()
    const dispatch: AppDispatch = useDispatch();

    const groups = useSelector(rootGroupSelector)
    const notes = useSelector(ungroupedNotesSelector)

    const listRef = useRef(null)

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDropdown = () => setIsOpen(prev => !prev);

    return (
        <div className={`z-10 absolute w-full h-full lg:relative lg:w-[20%] ${isSidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            {/* Sidebar animation */}
            <motion.div
                animate={{
                    gridTemplateColumns: isSidebarOpen ? '1fr' : '0fr',
                }}
                transition={{ duration: 0.3 }}
                className="grid w-full h-full grid-cols-[0fr]"
            >
                {/* Sidebar Container */}
                <div className="overflow-hidden w-full h-full">
                    <aside className="relative w-full h-full flex flex-col px-[20px] bg-bg-dark lg:w-[220px] lg:max-w-[220px] min-h-0">
                        {/* Top Section: Profile + Navigation */}
                        <div>
                            <UserProfile />
                            <ul className="mt-4 space-y-1">
                                <NavLink
                                    title={"Home"}
                                    icon={faHouse}
                                    to={"/notes/home"}
                                />
                                <li
                                    onClick={() => {
                                        OpenSearch();
                                        if (!window.matchMedia('(min-width: 1024px)').matches) {
                                            setSideBar(false)
                                        }
                                    }}
                                    className="transition hover:cursor-pointer flex gap-[20px] items-center hover:bg-bg-light py-1.5 px-2 rounded-lg"
                                >
                                    <FontAwesomeIcon className="text-white size-[20px]" icon={faMagnifyingGlass} />
                                    <p className="text-sm text-white">Search</p>
                                </li>
                            </ul>
                        </div>

                        {/* Bottom Section: Notes / Groups (Scrollable) */}
                        <div className="mt-4 overflow-y-auto min-h-0 flex-grow">
                            <ul ref={listRef} className="space-y-2">
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

                                <AnimatePresence mode="wait">
                                    <ul className="space-y-1">
                                        {[...(groups.map(group => ({ ...group, type: "group" }))),
                                        ...notes.map(note => ({ ...note, type: "note" }))]
                                            .sort((a, b) => a.position - b.position)
                                            .map(item =>
                                                item.type === "group" ? (
                                                    <GroupTree
                                                        key={item._id}
                                                        group={item as Group}
                                                        dragConstraint={listRef}
                                                    />
                                                ) : (
                                                    <NoteDisplay
                                                        key={item._id}
                                                        noteId={item._id}
                                                        draggable={true}
                                                        dragConstraint={listRef}
                                                    />
                                                )
                                            )}
                                    </ul>
                                </AnimatePresence>
                            </ul>
                        </div>
                    </aside>
                </div>
            </motion.div>
        </div>
    )
}


function NavLink({ title, icon, to, search }: { title: string, icon: IconDefinition, to?: string, search?: string }) {
    const { setSideBar } = useSidebar()
    return (
        <Link
            onClick={() => {
                if (!window.matchMedia('(min-width: 1024px)').matches) {
                    setSideBar(false)
                }
            }}
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
        </Link >
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
