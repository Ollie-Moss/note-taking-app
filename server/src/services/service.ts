import { Model, Types } from "mongoose";

export class Service<T> {
    constructor(public model: Model<T>) { }
    protected uid: string | null = null;

    setUser(id: string) {
        this.uid = id
    };

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data).then(data => data.toObject());
    }

    async findById(id: string) {
        return this.model.findOne({ _id: id, uid: this.uid }).lean<T & { _id: Types.ObjectId }>();
    }

    async findAll(filter: object = { uid: this.uid }) {
        return this.model.find(filter).lean<(T & { _id: Types.ObjectId })[]>();
    }

    async update(id: string, data: Partial<T>) {
        return this.model.findOneAndUpdate({ _id: id, uid: this.uid }, data, { new: true }).lean<T & { _id: Types.ObjectId }>();
    }

    async delete(id: string) {
        return this.model.findOneAndDelete({ _id: id, uid: this.uid }).lean<T & { _id: Types.ObjectId }>();
    }
}
