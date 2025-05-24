import { Model, Types } from "mongoose"
import { Group, IGroup } from "../models/groupModel"
import { MoveableService } from "./moveableService"
import { Note, NotePreview } from "../models/noteModel"
import { noteService } from "./services"
import { MoveableDocument } from "../models/moveableModel"

export class GroupService extends MoveableService<IGroup> {
    constructor(model: Model<IGroup>) { super(model) }

    // Overrides allEntities to include notes and groups under the same parent
    async allEntities(filter: object = {}): Promise<MoveableDocument[]> {
        return [...await super.allEntities(filter), ...await noteService.model.find({ ...filter, uid: this.uid })]
            .sort((a, b) => a.position - b.position);
    }
    // Recursively check if targetId is inside groupId to prevent circular references
    async checkInGroup(targetId: string, groupId: string): Promise<boolean> {
        // Get all direct children groups of the groupId
        const children = await this.findAll({ parentId: groupId })
        if (targetId == groupId) {
            return true
        }
        // Recursively check if targetId is inside any child group
        for (const child of children) {
            if (child._id.toString() == targetId) {
                return true
            }
            if (await this.checkInGroup(targetId, child._id.toString())) {
                return true
            }
        }
        return false // Not found inside group or descendants
    }

    // Override update to prevent moving a group inside its own descendant
    async update(id: string, data: Partial<IGroup>): Promise<(IGroup & { _id: Types.ObjectId }) | null> {
        if (data.parentId) {
            if (await this.checkInGroup(data.parentId.toString(), id)) {
                delete data.parentId;
            }
        }
        return super.update(id, data);
    }

    async delete(id: string): Promise<(IGroup & { _id: Types.ObjectId }) | null> {
        const notes: Note[] = await noteService.findNotes({ parentId: id })
        for (const note of notes) {
            await noteService.delete(note._id.toString())
        }
        const children: Group[] = await this.findGroups({ parentId: id })
        for (const child of children) {
            await this.delete(child._id.toString());
        }
        return super.delete(id)
    }

    // Recursively retrieves groups and optionally includes their child groups and notes
    // Optionally filter by parentId (what group its in)
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

    // Retrieves a single group by ID with optional child group and note details
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

    async create(data: Partial<IGroup>) {
        const entity = await super.create({ ...data })
        return { ...entity, notes: [], children: [] };
    }

    validate(group: Partial<Group>): { passed: boolean, message?: string } {
        // Check if required fields are present
        if (group.title !== undefined && typeof group.title !== "string") {
            return { passed: false, message: "Title must be a string." };
        }
        // Validate position
        if (group.position !== undefined && typeof group.position !== "number") {
            return { passed: false, message: "Position must be a valid number." };
        }
        // Validate uid
        if (group.uid !== undefined && !Types.ObjectId.isValid(group.uid.toString())) {
            return { passed: false, message: "A valid user ID (uid) is required." };
        }
        // Validate parentId
        if (group.parentId !== undefined &&
            (group.parentId !== null && group.parentId !== undefined && !Types.ObjectId.isValid(group.parentId.toString()))) {
            return { passed: false, message: "Invalid parentId." };
        }
        return { passed: true };
    }
}
