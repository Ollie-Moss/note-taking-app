import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faFile, faMagnifyingGlass, faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Note } from "../models/note";
import { CreateNote } from "../controllers/noteController";
import useNotes from "../lib/useNotes";


export default function Sidebar() {
    // fetch notes
    const { notes, isPending, error } = useNotes();

    async function CreateNoteHandler(_e: React.MouseEvent<SVGSVGElement>) {
        const note: Note = {
            _id: "",
            title: "",
            contents: "",
            uid: ""
        };
        const newNote = await CreateNote(note);
        console.log(newNote)
    }

    return (
        <aside className="bg-bg-dark h-full w-full max-w-[220px] flex flex-col px-[20px]">
            <UserProfile />
            <ul className="mt-[20%]">
                <NavLink
                    title={"Home"}
                    icon={faHouse}
                    to={"/"}
                />
                <NavLink
                    title={"Search"}
                    icon={faMagnifyingGlass}
                    search="?search"
                />
            </ul>
            <ul className="mt-[50%]">
                <li className="flex items-center justify-between">
                    <p className="text-sm text-white">Notes</p>
                    <FontAwesomeIcon
                        onClick={CreateNoteHandler}
                        className="text-white"
                        icon={faPlus} />
                </li>
                {notes?.map(note => (<NavLink
                    key={note._id}
                    title={note.title}
                    icon={faFile}
                    to={"/notes"}
                    search={`?id=${note._id}`}
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
            <li className="flex gap-[20px] items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                <FontAwesomeIcon className="text-white size-[24px]" icon={icon} />
                <p className="text-sm text-white">{title}</p>
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
