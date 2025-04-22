import { model, Schema } from "mongoose"

export interface IUser {
    uid: number,
    name: string,
    email: string
    profile_picture: string | null
}

export const UserSchema = new Schema<IUser>({
    uid: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profile_picture: { type: String, required: true },
});

export const UserModel = model("UserModel", UserSchema);
