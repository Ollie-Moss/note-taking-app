import { model, Schema, Types } from "mongoose"

// User interface (without _id)
export interface IUser {
    name: string;               // Users display name
    email: string;              // Users email address
    password_hash: string;      // Hashed password
}

// Full User type including MongoDB _id field
export type User = IUser & {
    _id: Types.ObjectId
}

// Mongoose schema for the User collection
export const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password_hash: { type: String, required: true },
});

export const UserModel = model("users", UserSchema);
