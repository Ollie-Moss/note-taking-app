import { Service } from "./service";
import { Model } from "mongoose";
import { Moveable } from "../models/moveableModel";

export class MoveableService<T extends Moveable> extends Service<T> {
    constructor(model: Model<T>) { super(model) }

    async move(id: string, beforeId: string) {
        const before: T | null = await this.findById(beforeId)
        const moveable: T | null = await this.findById(id);
        const results: T[] = await this.model.find({}).sort({ position: 1 });
        if (!moveable || !before) return;
        // move to first
        if (!beforeId) {
            moveable.position = 100;
            if (results.length > 0) {
                moveable.position = results[0].position / 2
            }
            await this.update(id, moveable);
            return
        }
        const index = results.indexOf(before)
        if (index == -1) return
        // move to last
        if (index + 1 > results.length - 1) {
            moveable.position = results[index].position + 100
        }
        // move between
        moveable.position = (results[index + 1].position + before.position) / 2
        return await this.update(id, moveable);
    }
}
