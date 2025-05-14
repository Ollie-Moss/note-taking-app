import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGroup, useGroups, useNotes } from "../lib/noteProvider";
import { faFolder, faFolderClosed, faFolderOpen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NoteDisplay } from "./noteDisplay";
import { RefObject } from "react";
import { useConfirm } from '../lib/confirmationProvider'
import { useNavigate } from "react-router";


export function GroupTree({ dragConstraint, groupId, offset = 0 }: { offset?: number, dragConstraint: RefObject<HTMLUListElement>, groupId: string }) {
    const { group, updateGroup, deleteGroup } = useGroup(groupId)
    const { Confirm } = useConfirm()
    const navigate = useNavigate()

    async function HandleDelete(e: React.MouseEvent<SVGSVGElement>) {
        e.preventDefault();
        e.stopPropagation()
        const confirmed = await Confirm("Are you sure you wish to delete this group?");
        if (confirmed) {
            deleteGroup(groupId);
            const params = new URLSearchParams(location.search)
            if (location.pathname == "/notes") {
                for (const noteId of group.notes) {
                    if (params.has("id", noteId)) {
                        navigate({
                            pathname: "/notes/home", search: ""
                        })
                    }
                }
            }
        }
    }

    return (
        <li >
            <div
                onClick={() => updateGroup(groupId, { open: !group.open })}
                data-group-id={group._id}
                style={{ paddingLeft: 0.5 + offset + "rem" }} className="bg-bg-dark hover:cursor-pointer transition-colors w-full max-w-full justify-between flex items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                <div className="w-full justify-between overflow-x-hidden flex items-center gap-[8px]">
                    <FontAwesomeIcon className="text-white h-[20px]" icon={group.open ? faFolderOpen : faFolderClosed} />
                    <p className={`flex-1 overflow-x-hidden whitespace-nowrap text-ellipsis text-xs text-white 
                                ${group.title == "" ? "opacity-[0.6] italic" : ""}`}>
                        {group.title == "" ?
                            "Untitled Group"
                            :
                            group.title
                        }</p>

                    <FontAwesomeIcon
                        onClick={HandleDelete}
                        className="hover:text-red-400 text-white size-[16px]"
                        icon={faTimes} />
                </div>
            </div>
            {group.open ?
                <ul >
                    {group.notes.map(noteId => (
                        <NoteDisplay
                            draggable={true}
                            key={noteId} noteId={noteId} dragConstraint={dragConstraint} offset={offset + 1} />
                    ))}
                    {group.children.map(childId => (
                        <GroupTree key={childId} groupId={childId} dragConstraint={dragConstraint} offset={offset + 1} />
                    ))}
                </ul>
                :
                <></>
            }
        </li>
    );
}
