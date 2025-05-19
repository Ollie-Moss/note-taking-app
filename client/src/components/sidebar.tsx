import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faMagnifyingGlass, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { NoteDisplay } from "./noteDisplay";
import { useSearch } from "../lib/searchProvider";
import { useGroups, useNotes } from "../lib/noteProvider";
import { Note } from "../models/note";
import { GroupTree } from "./groupTree";
import { useRef, useState } from "react";
import Dropdown from "./dropdown";
import {useDispatch, useSelector, useStore} from 'react-redux'
import { RootState } from "../store";


export default function Sidebar() {
    const { rootGroups, createGroup } = useGroups();
    const { ungroupedNotes, createNote } = useNotes()
    const { OpenSearch } = useSearch()
    const groups = useSelector((state: RootState) => state.groups)
    console.log(groups)
    const listRef = useRef(null)

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

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
                                    onclick: createNote
                                },
                                {
                                    title: "Create Group",
                                    onclick: createGroup
                                }
                            ]
                            } />
                    </div>
                </li>
                {rootGroups.map(groupId => (
                    <GroupTree key={groupId} groupId={groupId} dragConstraint={listRef} />
                ))}
                {ungroupedNotes.map(noteId => (
                    <NoteDisplay
                        key={noteId}
                        noteId={noteId}
                        draggable={true}
                        dragConstraint={listRef}
                    />))}
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
