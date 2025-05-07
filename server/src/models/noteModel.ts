import { model, Schema, Types } from "mongoose";

export interface INote {
    title: string,
    contents: string,
    favourite: boolean,
    editedAt: Date,
    uid: Types.ObjectId,
}

export type Note = {
    _id: string,
    title: string,
    contents: string,
    favourite: boolean,
    editedAt: Date,
    uid: string,
}

export const NoteSchema = new Schema<INote>({
    title: { type: String, required: false },
    editedAt: { type: Date, required: true },
    favourite: { type: Boolean, required: true },
    // Setter ensures that if the contents is nothing it is set to a json object
    contents: { type: String, required: false, set: (c: any) => !c || c == "" ? "{}" : c },
    uid: { type: Schema.Types.ObjectId, required: true },
});

export const NoteModel = model("notes", NoteSchema);
