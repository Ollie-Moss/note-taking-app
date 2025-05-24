import { model, Schema, Types } from "mongoose";
import { Moveable } from "./moveableModel";

// Interface for a group document (inherits position & parentId from Moveable )
export interface IGroup extends Moveable {
    title: string,                      // Group name/title
    position: number,                   // Ordering position
    uid: Types.ObjectId,                // User ID who owns this group
    parentId: Types.ObjectId | null,    // Optional parent group (for nesting)
    open: boolean                       // UI state: whether group is expanded
}

// Full group type including MongoDB _id field
export type Group = IGroup & {
    _id: Types.ObjectId,
}

// Group with attached notes
export type GroupWithNotes = Group & {
    notes: Types.ObjectId[]
}

// Mongoose schema for the Group collection
export const GroupSchema = new Schema<IGroup>({
    title: { type: String },
    position: { type: Number, required: true },
    open: { type: Boolean, required: true },
    uid: { type: Schema.Types.ObjectId, required: true },
    parentId: { type: Schema.Types.ObjectId },
})

export const GroupModel = model("groups", GroupSchema)
