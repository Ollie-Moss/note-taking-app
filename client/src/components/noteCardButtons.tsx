import { useLocation, useNavigate } from "react-router";
import { useConfirm } from "../lib/confirmationProvider";
import { deleteNoteAsync, updateNoteAsync } from "../slices/noteSlice";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as farStar, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { Note } from "../models/note";

export default function NoteCardButtons({ note }: { note: Note }) {
    const location = useLocation()
    const navigate = useNavigate();

    const dispatch: AppDispatch = useDispatch();

    const { Confirm } = useConfirm();

    // Toggles favourite state
    async function HandleFavourite(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault()
        e.stopPropagation()
        dispatch(updateNoteAsync({ id: note._id, note: { favourite: !note.favourite } }));
    }

    // Shows a confirmation box before dispatching delete
    async function HandleDelete(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        e.stopPropagation()
        const confirmed = await Confirm("Are you sure you wish to delete this note?");
        if (confirmed) {
            dispatch(deleteNoteAsync(note._id));
            const params = new URLSearchParams(location.search)
            if (location.pathname == "/notes" && params.has("id", note._id)) {
                navigate({
                    pathname: "/notes/home", search: ""
                })
            }
        }
    }
    return (
        <div className="flex gap-1 items-center justify-between">
            <FontAwesomeIcon
                className="hover:text-yellow-500 fa-regular text-white size-[16px]"
                onPointerUp={HandleFavourite}
                icon={note.favourite ? fasStar : farStar} />
            <FontAwesomeIcon
                onPointerUp={HandleDelete}
                className="hover:text-red-400 text-white size-[16px]"
                icon={faTrashCan} />
        </div>
    )
}
