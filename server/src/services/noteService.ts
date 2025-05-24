import { Model, Types } from "mongoose";
import { MoveableService } from "./moveableService";
import { INote } from "../models/noteModel";
import { groupService } from "./services";
import { MoveableDocument } from "../models/moveableModel";

// NoteService handles all Notes and their related logic
// It inherits MoveableService to support reordering 
export class NoteService extends MoveableService<INote> {
    constructor(model: Model<INote>) { super(model) }

    // Overrides allEntities to include notes and groups under the same parent
    async allEntities(filter: object = {}): Promise<MoveableDocument[]> {
        return [...await super.allEntities(filter), ...await groupService.model.find({ ...filter, uid: this.uid })]
            .sort((a, b) => a.position - b.position);
    }

    // Fetches notes with optional filters
    // 'parentId' filter notes by parent group
    // 'preview' if true it returns NotePreview
    async findNotes({ parentId, preview }:
        { parentId?: string | null, preview?: boolean }) {

        const filter = {
            uid: this.uid,
            ...(parentId != undefined ? { parentId } : {})
        }
        const query = this.model.find(filter)
        if (preview) {
            // Only select preview-relevant fields
            query.select('_id title editedAt position favourite parentId')
        }
        return query.sort({ position: 1 })
    }

    // validate a given note
    validate(note: Partial<INote>): { passed: boolean, message?: string } {
        // Title is optional but if present must not be empty
        if (note.title !== undefined && typeof note.title !== "string") {
            return { passed: false, message: "Title must be a string." };
        }

        // Contents are optional but should be a string if provided
        if (note.contents !== undefined && typeof note.contents !== "string") {
            return { passed: false, message: "Contents must be a string." };
        }

        // Ensure editedAt is a valid date
        if (note.editedAt !== undefined && isNaN(new Date(note.editedAt).getTime())) {
            return { passed: false, message: "A valid editedAt date is required." };
        }

        // Favourite must be a boolean
        if (note.favourite !== undefined && typeof note.favourite !== "boolean") {
            return { passed: false, message: "Favourite must be a boolean." };
        }

        // Position must be a valid number
        if (note.position !== undefined && typeof note.position !== "number") {
            return { passed: false, message: "Position must be a valid number." };
        }

        // UID must be present and a valid ObjectId
        if (note.uid !== undefined && !Types.ObjectId.isValid(note.uid.toString())) {
            return { passed: false, message: "A valid user ID (uid) is required." };
        }

        // Validate parentId
        if (note.parentId !== undefined && (note.parentId !== null && !Types.ObjectId.isValid(note.parentId.toString()))) {
            return { passed: false, message: "Invalid parentId." };
        }

        // All validations passed
        return { passed: true };
    }
}
