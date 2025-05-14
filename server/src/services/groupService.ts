import { Document, Model, Types } from "mongoose"
import { Group, IGroup } from "../models/groupModel"
import { MoveableService } from "./moveableService"
import { NoteService } from "./noteService"
import { Note, NotePreview } from "../models/noteModel"
import { noteService } from "./services"

export class GroupService extends MoveableService<IGroup> {
    constructor(model: Model<IGroup>, private noteService: NoteService) { super(model) }

    setUser(id: string) {
        super.setUser(id)
        this.noteService.setUser(id)
    };
    async delete(id: string): Promise<(IGroup & { _id: Types.ObjectId }) | null> {
        const notes: Note[] = await noteService.findNotes({ parentId: id })
        for (const note of notes) {
            this.noteService.delete(note._id.toString())
        }

        return super.delete(id)
    }
    async create(data: Partial<IGroup & { notes: string[] }>) {
        const group = await super.create(data);

        return { ...group, notes: [], children: [] };
    }
    async findGroups({ parentId, withNotes, withChildren }:
        { parentId?: string | null, withNotes?: boolean, withChildren?: boolean }) {

        const filter = {
            uid: this.uid,
            ...(parentId != undefined ? { parentId } : {})
        }

        const groups: Group[] = await this.model.find(filter).sort({ position: 1 }).lean<Group[]>()
        const results: (Group & { notes?: (NotePreview | string)[], children?: (Group | string)[] })[] = []

        for (const group of groups) {
            const notes: NotePreview[] = await this.noteService.findNotes({
                parentId: group._id.toString(),
                preview: true
            });
            const children: Group[] = await this.findGroups({ parentId: group._id.toString() })

            results.push({
                ...group,
                notes: (withNotes ? notes : notes.map(note => note._id.toString())),
                children: (withChildren ? children : children.map(group => group._id.toString()))
            })
        }
        return results;
    }

    async findGroup(id: string, { withNotes, withChildren }:
        { withNotes?: boolean, withChildren?: boolean }) {

        const group: Group | null = await this.findById(id)
        if (!group) return null

        const notes: NotePreview[] = await this.noteService.findNotes({
            parentId: group._id.toString(),
            preview: true
        });
        const children: Group[] = await this.findGroups({ parentId: group._id.toString() })

        return {
            ...group,
            notes: (withNotes ? notes : notes.map(note => note._id.toString())),
            children: (withChildren ? children : children.map(group => group._id.toString()))
        };
    }
}
