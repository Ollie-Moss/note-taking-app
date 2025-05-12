import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGroup, useNotes } from "../lib/noteProvider";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { NoteDisplay } from "./noteDisplay";
import { RefObject } from "react";

export function GroupTree({ dragConstraint, groupId, offset = 0 }: { offset?: number, dragConstraint: RefObject<HTMLUListElement>, groupId: string }) {
    const { group } = useGroup(groupId)
    const { notes } = useNotes()

    return (
        <li>
            <div style={{ paddingLeft: offset }} className="bg-bg-dark hover:cursor-pointer transition-colors w-full max-w-full justify-between flex items-center hover:bg-bg-light py-1.5 px-2 rounded-lg">
                <div className="justify-between overflow-x-hidden flex items-center gap-[8px]">
                    <FontAwesomeIcon className="text-white size-[20px]" icon={faFolder} />
                    <p className={`flex-1 overflow-x-hidden whitespace-nowrap text-ellipsis text-xs text-white 
                                ${group.title == "" ? "opacity-[0.6] italic" : ""}`}>
                        {group.title == "" ?
                            "Untitled Group"
                            :
                            group.title
                        }</p>
                </div>
            </div>
            {group.open ?
                <ul >
                    {group.notes.map(noteId => (
                        <NoteDisplay key={noteId} noteId={noteId} dragConstraint={dragConstraint} offset={offset + 1} />
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
