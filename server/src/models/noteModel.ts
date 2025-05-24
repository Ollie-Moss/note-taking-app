import { model, Schema, Types } from "mongoose";
import { Moveable } from "./moveableModel";

// Interface for previewing notes (e.g., in lists)
export interface NotePreview extends Moveable {
    _id: Types.ObjectId,        // MongoDB unique identifier
    title: string,              // Note title
    editedAt: Date,             // Last edited timestamp
    favourite: boolean          // Whether note is marked as favourite
}

// Interface for full note data (excluding _id)
export interface INote extends Moveable {
    contents: string,           // Full note content (stored as stringified JSON)
    uid: Types.ObjectId,        // ID of the user who owns the note
    title: string,              // Note title
    editedAt: Date,             // Last edited date
    favourite: boolean          // Favourite status
}

// Full Note type including MongoDB _id field
export type Note = INote & {
    _id: Types.ObjectId,
}


// Mongoose schema definition for a Note
export const NoteSchema = new Schema<INote>({
    title: { type: String, required: false },
    editedAt: { type: Date, required: true },
    favourite: { type: Boolean, required: true },
    parentId: { type: Schema.Types.ObjectId },
    position: { type: Number, required: true },
    contents: {
        type: String,
        required: false,
        // Ensures empty content is stored as "{}"
        set: (c: any) => !c || c == "" ? "{}" : c
    },
    uid: { type: Schema.Types.ObjectId, required: true },
});

export const NoteModel = model("notes", NoteSchema);
