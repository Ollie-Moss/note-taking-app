import { model, Schema, Types } from "mongoose";

export type NotePreview = {
    _id: Types.ObjectId,
    title: string,
    editedAt: Date,
    position: number,
    favourite: boolean
}

export interface INote {
    title: string,
    contents: string,
    favourite: boolean,
    editedAt: Date,
    position: number,
    uid: Types.ObjectId,
    groupId: Types.ObjectId | null
}

export type Note = INote & {
    _id: Types.ObjectId,
}

export const NoteSchema = new Schema<INote>({
    title: { type: String, required: false },
    editedAt: { type: Date, required: true },
    favourite: { type: Boolean, required: true },
    groupId: { type: Schema.Types.ObjectId },
    position: { type: Number, required: true },
    // Setter ensures that if the contents is nothing it is set to a json object (could be done in controller for clarity)
    contents: { type: String, required: false, set: (c: any) => !c || c == "" ? "{}" : c },
    uid: { type: Schema.Types.ObjectId, required: true },
});

export const NoteModel = model("notes", NoteSchema);
