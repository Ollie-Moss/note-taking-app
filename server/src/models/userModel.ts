import { model, Schema, Types } from "mongoose"

export interface IUser {
    name: string,
    email: string,
    profile_picture: string | null,
    password_hash: string
}

export type User = {
    _id: string,
    name: string,
    email: string,
    profile_picture: string | null,
}

export const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    profile_picture: { type: String, },
    password_hash: { type: String, required: true },
});

export const UserModel = model("users", UserSchema);
