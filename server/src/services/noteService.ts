import { Model } from "mongoose";
import { MoveableService } from "./moveableService";
import { INote } from "../models/noteModel";

export class NoteService extends MoveableService<INote> {
    constructor(model: Model<INote>) { super(model) }

    async findNotes({ parentId: groupId, preview }:
        { parentId?: string | null, preview?: boolean }) {

        const filter = {
            ...(groupId != undefined ? { groupId } : {})
        }
        const query = this.model.find(filter)
        if (preview) {
            query.select('_id title editedAt position favourite groupId')
        }
        return query.sort({ position: 1 })
    }
}
