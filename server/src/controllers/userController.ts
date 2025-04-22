import { IUser, UserModel, UserSchema } from "../models/user";

export async function CreateUser(user: IUser) {
    UserModel.create(user);
}
