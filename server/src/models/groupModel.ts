import { model, Schema, Types } from "mongoose";
import { Note } from "./noteModel";
import { Moveable } from "./moveableModel";


export interface IGroup extends Moveable{
    title: string,
    position: number,
    uid: Types.ObjectId,
    parentId: Types.ObjectId | null,
    open: boolean
}

export type Group = IGroup & {
    _id: Types.ObjectId,
}

export type GroupWithNotes = Group & { notes: Types.ObjectId[] }

export const GroupSchema = new Schema<IGroup>({
    title: { type: String },
    position: { type: Number, required: true },
    open: { type: Boolean, required: true },
    uid: { type: Schema.Types.ObjectId, required: true },
    parentId: { type: Schema.Types.ObjectId },
})

export const GroupModel = model("groups", GroupSchema)
