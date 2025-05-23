import { Model, Types } from "mongoose";
import { MoveableService } from "./moveableService";
import { INote } from "../models/noteModel";
import { groupService } from "./services";

export class NoteService extends MoveableService<INote> {
    constructor(model: Model<INote>) { super(model) }

    async create(data: Partial<INote>): Promise<INote> {
        const entities = [...await this.findAll({ parentId: null }),
        ...await groupService.findAll({ parentId: null })];

        let position = 100;
        if (entities.length > 0) {
            position = entities[entities.length - 1].position + 100
        }
        const entity = await super.create({ ...data, position });
        return entity
    }

    async move(id: string, targetId: string, position: "before" | "after"): Promise<(INote & { _id: Types.ObjectId; }) | null | undefined> {
        const currentEntity = await this.findById(id);
        const allEntities = [...await this.model.find({ parentId: currentEntity?.parentId }), ...await groupService.model.find({ parentId: currentEntity?.parentId })].sort((a, b) => a.position - b.position)
        return await this.moveInList(id, targetId, position, allEntities);
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
