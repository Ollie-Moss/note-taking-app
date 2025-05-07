import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faFile, faMagnifyingGlass, faPlus, faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { Note } from "../models/note";
import { CreateNote, DeleteNote } from "../controllers/noteController";
import useNotes from "../lib/useNotes";
import { useQueryClient } from "@tanstack/react-query";


export default function Sidebar({ onSearchClick }: { onSearchClick: () => void }) {
    const queryClient = useQueryClient()

    // fetch notes
    const { notes, isPending, error } = useNotes();

    async function DeleteNoteHandler(noteId: string) {
        const note = await DeleteNote(noteId);
        queryClient.setQueryData(["notes"],
            (prev: Note[]) => prev.filter(note => note._id != noteId));
    }

    async function CreateNoteHandler(_e: React.MouseEvent<SVGSVGElement>) {
        const note: Note = {
            _id: "",
            title: "",
            contents: "",
            uid: ""
        };
        const newNote = await CreateNote(note);
        console.log(newNote)
        queryClient.setQueryData(["notes"],
            (prev: Note[]) => [...prev, newNote]);
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
                <li
                    onClick={onSearchClick}
                    className="hover:cursor-pointer flex gap-[20px] items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                    <FontAwesomeIcon className="text-white size-[20px]" icon={faMagnifyingGlass} />
                    <p className="text-sm text-white">Search</p>
                </li >
            </ul>
            <ul className="mt-[50%]">
                <li className="flex items-center justify-between">
                    <p className="text-sm text-white">Notes</p>
                    <FontAwesomeIcon
                        onClick={CreateNoteHandler}
                        className="text-white pr-2"
                        icon={faPlus} />
                </li>
                {notes?.map(note => (<NoteLink
                    key={note._id}
                    deleteNote={() => DeleteNoteHandler(note._id)}
                    title={note.title}
                    to={"/notes"}
                    search={`?id=${note._id}`}
                />))}
            </ul>

        </aside>
    )
}

function NoteLink({ title, to, search, deleteNote }: { title: string, to?: string, search?: string, deleteNote: () => void }) {
    return (
        <Link
            to={{
                pathname: to,
                search: search
            }} >
            <li className="w-full max-w-full justify-between flex items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                <div className="justify-between overflow-x-hidden flex items-center gap-[8px]">
                    <FontAwesomeIcon className="text-white size-[20px]" icon={faFile} />
                    <p className={`flex-1 overflow-x-hidden whitespace-nowrap text-ellipsis text-xs text-white 
                                ${title == "" ? "opacity-[0.6] italic" : ""}`}>
                        {title == "" ?
                            "Untitled Note"
                            :
                            title
                        }</p>
                </div>
                <FontAwesomeIcon
                    onClick={deleteNote}
                    className="text-white size-[16px]"
                    icon={faTimes} />
            </li >
        </Link>
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
