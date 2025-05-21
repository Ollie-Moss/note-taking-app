import { Document, Model, Types } from "mongoose"
import { Group, IGroup } from "../models/groupModel"
import { MoveableService } from "./moveableService"
import { Note, NotePreview } from "../models/noteModel"
import { noteService } from "./services"

export class GroupService extends MoveableService<IGroup> {
    constructor(model: Model<IGroup>) { super(model) }

    async create(data: Partial<IGroup>) {
        const entities = [...await this.findAll({ parentId: null }),
        ...await noteService.findAll({ parentId: null })];

        let position = 100;
        if (entities.length > 0) {
            position = entities[entities.length - 1].position + 100
        }
        const entity = await super.create({ ...data, position });

        return { ...entity, notes: [], children: [] };
    }

    async move(id: string, targetId: string, position: "before" | "after"): Promise<(IGroup & { _id: Types.ObjectId; }) | null | undefined> {
        const currentEntity = await this.findById(id);
        const allEntities = [...await this.findAll({ parentId: currentEntity?.parentId }), ...await noteService.findAll({ parentId: currentEntity?.parentId })]
        return await this.moveInList(id, targetId, position, allEntities);
    }

    setUser(id: string) {
        super.setUser(id)
        noteService.setUser(id)
    };
    async delete(id: string): Promise<(IGroup & { _id: Types.ObjectId }) | null> {
        const notes: Note[] = await noteService.findNotes({ parentId: id })
        for (const note of notes) {
            noteService.delete(note._id.toString())
        }

        return super.delete(id)
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
            const notes: NotePreview[] = await noteService.findNotes({
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

        const notes: NotePreview[] = await noteService.findNotes({
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
