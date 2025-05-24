import { Service } from "./service";
import { Model } from "mongoose";
import { Moveable, MoveableDocument } from "../models/moveableModel";

// Derives from Generic Service class to enable CRUD operations
// Adds position-based sorting logic for moveable entities (notes, groups)
export class MoveableService<T extends Moveable> extends Service<T> {
    constructor(model: Model<T>) { super(model); }

    // Minimum gap between positions before recalculating positions
    private recalculationThreshold = 1;

    // Retrieve all entities for the current user (and optional additional filters)
    // This allows for derived classes to customize this behaviour
    // (Notes & groups all entities include each other)
    async allEntities(filter: object = {}): Promise<MoveableDocument[]> {
        const entities = await this.model.find({ ...filter, uid: this.uid })
        return entities.sort((a, b) => a.position - b.position)
    }

    // Creates a new entity with a calculated position at the end of top-level entities
    // (entities where parentId = null)
    async create(data: Partial<T>): Promise<T> {
        const entities = await this.allEntities({ parentId: null });

        // Position = 100 if empty otherwise position is last item + 100
        let position = 100;
        if (entities.length > 0) {
            position = entities[entities.length - 1].position + 100
        }

        // Create entity with calculated position
        const entity = await super.create({ ...data, position });
        return entity
    }

    // Reassign evenly spaced position values to ensure proper ordering
    async recalculatePositions(allEntities: MoveableDocument[]) {
        for (let i = 0; i < allEntities.length; i++) {
            const entity = allEntities[i];
            entity.position = (i + 1) * 100
            await entity.save()
        }
    }

    // Moves an entity relative to a target (before/after) and adjusts position accordingly
    // Recalculates positions if spacing becomes too small
    async move(id: string, targetId: string, position: 'before' | 'after') {
        const currentEntity = await this.findById(id);
        if (!currentEntity) return;

        // Get all entities belonging to the user
        const allEntities = await this.allEntities()

        const targetEntity = allEntities.find(entity => entity._id.toString() == targetId);
        if (!targetEntity) return;

        // Move entity to new group if parentId is different 
        if (currentEntity.parentId !== targetEntity.parentId) {
            await this.update(id, { parentId: targetEntity.parentId } as Partial<T>);
        }

        // Get all siblings (same parent group)
        const allEntitiesInGroup = await this.allEntities({ parentId: currentEntity.parentId })

        const index = allEntitiesInGroup.findIndex(entity => entity._id.toString() == targetEntity._id.toString())
        if (position == "before") {
            if (index == 0 || allEntitiesInGroup.length <= 2) {
                // Insert at the beginning
                currentEntity.position = targetEntity.position / 2;
            } else {
                // Insert between previous and target
                currentEntity.position = (allEntitiesInGroup[index - 1].position + targetEntity.position) / 2
            }
        }
        if (position == "after") {
            if (index == allEntitiesInGroup.length - 1) {
                // Insert at the end
                currentEntity.position = targetEntity.position + 100;
            } else {
                // Insert between target and next
                currentEntity.position = (allEntitiesInGroup[index + 1].position + targetEntity.position) / 2
            }

        }

        // Save updated position
        await this.update(id, currentEntity);


        // Recalculate all positions if gap is too small
        if (Math.abs(currentEntity.position - targetEntity.position) < this.recalculationThreshold) {
            //await this.recalculatePositions(allEntitiesInGroup);
        }

        return this.findById(id);
    }


}
