import { Service } from "./service";
import { Model } from "mongoose";
import { Moveable, MoveableDocument } from "../models/moveableModel";


export class MoveableService<T extends Moveable> extends Service<T> {
    private recalculationThreshold = 1;
    constructor(model: Model<T>) { super(model); }

    async recalculatePositions(allEntities: MoveableDocument[]) {
        for (let i = 0; i < allEntities.length; i++) {
            const entity = allEntities[i];
            entity.position = (i + 1) * 100
            await entity.save()
        }
    }

    async moveInList(id: string, targetId: string, position: 'before' | 'after', allEntities: MoveableDocument[]) {
        const currentEntity = await this.findById(id);

        const targetEntity = allEntities.find(entity => entity._id.toString() == targetId);

        if (!targetEntity || !currentEntity) return;

        if (position == "before") {
            const index = allEntities.indexOf(targetEntity)
            if (index == 0) {
                currentEntity.position = targetEntity.position / 2;
                await this.update(id, currentEntity);
                if (currentEntity.position < this.recalculationThreshold) {
                    await this.recalculatePositions(allEntities);
                }
                return this.findById(id);

            }
            currentEntity.position = (allEntities[index - 1].position + targetEntity.position) / 2
            await this.update(id, currentEntity);
            if (Math.abs(currentEntity.position - targetEntity.position) < this.recalculationThreshold) {
                await this.recalculatePositions(allEntities);
            }
            return this.findById(id);

        }
        if (position == "after") {
            const index = allEntities.indexOf(targetEntity)
            if (index == allEntities.length - 1) {
                currentEntity.position = targetEntity.position + 100;
                return await this.update(id, currentEntity);

            }
            currentEntity.position = (allEntities[index + 1].position + targetEntity.position) / 2
            await this.update(id, currentEntity);
            if (Math.abs(currentEntity.position - targetEntity.position) < this.recalculationThreshold) {
                await this.recalculatePositions(allEntities);
            }
            return this.findById(id);

        }
    }


}
