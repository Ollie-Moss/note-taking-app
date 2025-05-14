import { model, Schema, Types } from "mongoose";
import { MoveableService } from "../services/moveableService";
import { Moveable } from "./moveableModel";

export interface NotePreview extends Moveable{
    _id: Types.ObjectId,
    title: string,
    editedAt: Date,
    favourite: boolean
    parentId: Types.ObjectId | null
}

export interface INote extends NotePreview{
    contents: string,
    uid: Types.ObjectId,
}

export type Note = INote & {
    _id: Types.ObjectId,
}

export const NoteSchema = new Schema<INote>({
    title: { type: String, required: false },
    editedAt: { type: Date, required: true },
    favourite: { type: Boolean, required: true },
    parentId: { type: Schema.Types.ObjectId },
    position: { type: Number, required: true },
    // Setter ensures that if the contents is nothing it is set to a json object (could be done in controller for clarity)
    contents: { type: String, required: false, set: (c: any) => !c || c == "" ? "{}" : c },
    uid: { type: Schema.Types.ObjectId, required: true },
});

export const NoteModel = model("notes", NoteSchema);
