import { Model } from "mongoose"
import { Group, IGroup } from "../models/groupModel"
import { MoveableService } from "./moveableService"
import { NoteService } from "./noteService"
import { NotePreview } from "../models/noteModel"

export class GroupService extends MoveableService<IGroup> {
    constructor(model: Model<IGroup>, private noteService: NoteService) { super(model) }

    setUser(id: string) {
        super.setUser(id)
        this.noteService.setUser(id)
    };
    async findGroups({ parentId, withNotes, withChildren }:
        { parentId?: string | null, withNotes?: boolean, withChildren?: boolean }) {

        const filter = {
            ...(parentId != undefined ? { parentId } : {})
        }

        const groups: Group[] = await this.model.find(filter).sort({ position: 1 }).lean<Group[]>()
        const results: (Group & { notes?: (NotePreview | string)[], children?: Group[] })[] = []

        for (const group of groups) {
            const notes: NotePreview[] = await this.noteService.findNotes({
                parentId: group._id.toString(),
                preview: true
            });
            const newGroup: Group & { notes?: (NotePreview | string)[], children?: Group[] } = {
                ...group,
                notes: (withNotes ? notes : notes.map(note => note._id.toString())),
            }
            if (withChildren) {
                const children: Group[] = await this.findGroups({ parentId: group._id.toString() })
                newGroup.children = children
            }
            results.push(newGroup)
        }
        return results;
    }

    async findGroup(id: string, { withNotes, withChildren }:
        { withNotes?: boolean, withChildren?: boolean }) {

        const group: Group = await this.findById(id)

        const notes: NotePreview[] = await this.noteService.findNotes({
            parentId: group._id.toString(),
            preview: true
        });
        const newGroup: Group & { notes?: (NotePreview | string)[], children?: Group[] } = {
            ...group,
            notes: (withNotes ? notes : notes.map(note => note._id.toString())),
        }
        if (withChildren) {
            const children: Group[] = await this.findGroups({ parentId: group._id.toString() })
            newGroup.children = children
        }
        return group;
    }
}
