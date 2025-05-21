import { Model } from "mongoose";
import { MoveableService } from "./moveableService";
import { INote } from "../models/noteModel";

export class NoteService extends MoveableService<INote> {
    constructor(model: Model<INote>) { super(model) }

    async create(data: Partial<INote>): Promise<INote> {
        const notes = await this.findNotes({ parentId: null });
        let position = 100;
        if (notes.length > 0) {
            position = notes[notes.length - 1].position + 100
        }
        const note = await super.create({ ...data, position });
        return note
    }
    async findNotes({ parentId, preview }:
        { parentId?: string | null, preview?: boolean }) {

        const filter = {
            uid: this.uid,
            ...(parentId != undefined ? { parentId } : {})
        }
        const query = this.model.find(filter)
        if (preview) {
            query.select('_id title editedAt position favourite parentId')
        }
        return query.sort({ position: 1 })
    }
}
