import { Document, Types } from "mongoose";

export type MoveableDocument = ((Document<unknown, {}, Moveable> & Moveable & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}))

export interface Moveable {
    position: number;
    parentId: Types.ObjectId | null
}
