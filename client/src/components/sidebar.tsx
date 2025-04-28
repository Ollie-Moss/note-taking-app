import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router"
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faFile, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

type Note = { name: string, id: string }

export default function Sidebar() {
    // fetch notes
    const notes: Note[] = [{ id: "aaa", name: "new note" }];
    return (
        <aside className="bg-bg-dark h-full w-full max-w-[280px] flex flex-col px-[32px]">
            <UserProfile />
            <ul className="mt-[20%]">
                <li className="flex gap-[20px] items-center">
                    <FontAwesomeIcon className="text-white size-[24px]" icon={faHouse} />
                    <p className="text-sm text-white">Home</p>
                </li>
                <li className="flex gap-[20px] items-center">
                    <FontAwesomeIcon className="text-white size-[24px]" icon={faMagnifyingGlass} />
                    <p className="text-sm text-white">Search</p>
                </li>

            </ul>
            <ul className="mt-[50%]">
                <p className="text-sm text-white">Notes</p>
                {notes.map(note => (<NoteLink note={note} />))}
            </ul>

        </aside>
    )
}

function NoteLink({ note }: { note: Note }) {
    return (
        <li className="flex gap-[20px] items-center">
            <FontAwesomeIcon className="text-white size-[24px]" icon={faFile} />
            <Link className="text-sm text-white"
                key={note.id}
                to={{
                    pathname: `/notes`,
                    search: `?id=${note.id}`
                }} >
                {note.name}
            </Link>
        </li >
    )
}

function UserProfile() {
    // fetch user data
    return (
        <div className="flex items-center gap-1 py-[20px]">
            <img className="w-[38px] h-[38px] rounded-[4px] " src="https://lh3.googleusercontent.com/ogw/AF2bZyiTCz9EWqQcXTCYtYAX42aFoLgHJIaxaX71MzgdIKoihjE=s32-c-mo" />
            <p className="font-medium text-base text-white"> Name </p>
        </div>
    )
}
