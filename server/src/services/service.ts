import { Model, Types } from "mongoose";

// Generic base service class for basic crud operations
export class Service<T> {
    constructor(public model: Model<T>) { }

    // Create a new document
    async create(data: Partial<T>): Promise<(T & { _id: Types.ObjectId })> {
        const model = await this.model.create(data);
        return model.toObject() as (T & { _id: Types.ObjectId })
    }

    // Find a single document by ID 
    async findById(id: string) {
        return this.model.findOne({ _id: id }).lean<T & { _id: Types.ObjectId }>();
    }

    // Find all documents, optionally with a custom filter
    async findAll(filter: object = {}) {
        return this.model.find({ ...filter }).lean<(T & { _id: Types.ObjectId })[]>();
    }

    // Update a document by ID
    async update(id: string, data: Partial<T>) {
        return this.model.findOneAndUpdate({ _id: id }, data, { new: true }).lean<T & { _id: Types.ObjectId }>();
    }

    // Delete a document by ID
    async delete(id: string) {
        return this.model.findOneAndDelete({ _id: id }).lean<T & { _id: Types.ObjectId }>();
    }
}
