import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faAsterisk, faFile, faMagnifyingGlass, faPlus, faStar as fasStar, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { useNotes } from "../lib/noteContext";
import { useConfirm } from "../lib/confirmationProvider";
import { useEffect, useState } from "react";
import { useQueryParams } from "../lib/useQueryParams";
import { Note } from "../models/note";
import { NoteDisplay } from "./noteDisplay";


export default function Sidebar({ onSearchClick }: { onSearchClick: () => void }) {
    const { notes, createNote, deleteNote } = useNotes();

    return (
        <aside className="bg-bg-dark h-full w-0 lg:w-full lg:max-w-[220px] flex flex-col lg:px-[20px]">
            <UserProfile />
            <ul className="mt-[20%]">
                <NavLink
                    title={"Home"}
                    icon={faHouse}
                    to={"/notes/home"}
                />
                <li
                    onClick={onSearchClick}
                    className="transition hover:cursor-pointer flex gap-[20px] items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                    <FontAwesomeIcon className="text-white size-[20px]" icon={faMagnifyingGlass} />
                    <p className="text-sm text-white">Search</p>
                </li >
            </ul>
            <ul className="mt-[50%]">
                <li className="flex items-center justify-between">
                    <p className="text-sm text-white">Notes</p>
                    <FontAwesomeIcon
                        onClick={createNote}
                        className="hover:cursor-pointer text-white pr-2"
                        icon={faPlus} />
                </li>
                {notes?.map(note => (<NoteDisplay
                    key={note._id}
                    note={note}
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
