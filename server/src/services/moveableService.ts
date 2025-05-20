import { Service } from "./service";
import { Model } from "mongoose";
import { Moveable } from "../models/moveableModel";

export class MoveableService<T extends Moveable> extends Service<T> {
    constructor(model: Model<T>) { super(model) }

    async move(id: string, targetId: string, position: 'before' | 'after') {
        const currentEntity = await this.findById(id);

        const allEntities: (T & { _id: string })[] = await this.model.find({ parentId: currentEntity?.parentId }).sort({ position: 1 }).lean<(T & { _id: string })[]>();

        const targetEntity = allEntities.find(entity => entity._id == targetId);

        if (!targetEntity || !currentEntity) return;

        if (position == "before") {
            const index = allEntities.indexOf(targetEntity)
            if (index == 0) {
                currentEntity.position = targetEntity.position / 2;
                return await this.update(id, currentEntity);

            }
            currentEntity.position = (allEntities[index - 1].position + targetEntity.position) / 2
            return await this.update(id, currentEntity);

        }
        if (position == "after") {
            const index = allEntities.indexOf(targetEntity)
            if (index == allEntities.length - 1) {
                currentEntity.position = targetEntity.position + 100;
                return await this.update(id, currentEntity);

            }
            currentEntity.position = (allEntities[index + 1].position + targetEntity.position) / 2
            return await this.update(id, currentEntity);

        }
    }
}
