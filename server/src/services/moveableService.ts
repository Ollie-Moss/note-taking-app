import { Service } from "./service";
import { Model, Types } from "mongoose";
import { Moveable } from "../models/moveableModel";

export class MoveableService<T extends Moveable> extends Service<T> {
    constructor(model: Model<T>) { super(model) }

    async moveInList(id: string, targetId: string, position: 'before' | 'after', allEntities: (Moveable & { _id: Types.ObjectId })[]) {
        const currentEntity = await this.findById(id);

        const targetEntity = allEntities.find(entity => entity._id.toString() == targetId);

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
