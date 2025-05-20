import { Types } from "mongoose";

export interface Moveable {
    position: number;
    parentId: Types.ObjectId | null
}
