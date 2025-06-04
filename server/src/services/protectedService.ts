import { Model, Types } from "mongoose";

// Generic base service class for handling common database operations
export class ProtectedService<T> {
    constructor(public model: Model<T>) { }

    // Store the current authenticated user's ID
    protected uid: string | null = null;

    // Set the UID for future queries
    setUser(id: string) {
        this.uid = id
    };

    // Create a new document
    async create(data: Partial<T>): Promise<(T & { _id: Types.ObjectId })> {
        const model = await this.model.create(data);
        return model.toObject() as (T & { _id: Types.ObjectId })
    }

    // Find a single document by ID, scoped to current user
    async findById(id: string) {
        return this.model.findOne({ _id: id, uid: this.uid }).lean<T & { _id: Types.ObjectId }>();
    }

    // Find all documents, optionally with a custom filter
    async findAll(filter: object = {}) {
        return this.model.find({ ...filter, uid: this.uid }).lean<(T & { _id: Types.ObjectId })[]>();
    }

    // Update a document by ID, scoped to current user
    async update(id: string, data: Partial<T>) {
        return this.model.findOneAndUpdate({ _id: id, uid: this.uid }, data, { new: true }).lean<T & { _id: Types.ObjectId }>();
    }

    // Delete a document by ID, scoped to current user
    async delete(id: string) {
        return this.model.findOneAndDelete({ _id: id, uid: this.uid }).lean<T & { _id: Types.ObjectId }>();
    }
}
