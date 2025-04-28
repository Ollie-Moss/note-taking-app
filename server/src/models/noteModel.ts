import { model, Schema, Types } from "mongoose";

export interface INote {
    title: string,
    contents: string,
    uid: Types.ObjectId,
}

export type Note = {
    _id: string,
    title: string,
    contents: string,
    uid: string,
}

export const NoteSchema = new Schema<INote>({
    title: { type: String, required: true },
    contents: { type: String, required: true },
    uid: { type: Schema.Types.ObjectId, required: true },
});

export const NoteModel = model("notes", NoteSchema);
