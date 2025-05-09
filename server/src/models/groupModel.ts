import { model, Schema, Types } from "mongoose";
import { Note } from "./noteModel";


export interface IGroup {
    title: string,
    position: number,
    uid: Types.ObjectId,
    parentId: Types.ObjectId | null,
}

export type Group = IGroup & {
    _id: Types.ObjectId,
}

export const GroupSchema = new Schema<IGroup>({
    title: { type: String },
    position: { type: Number, required: true },
    uid: { type: Schema.Types.ObjectId, required: true },
    parentId: { type: Schema.Types.ObjectId },
})

export const GroupModel = model("groups", GroupSchema)
