import { Types } from "mongoose";
import { IUser, User, UserModel, UserSchema } from "../models/userModel";
import { AppError } from "../middlewares/errorHandler";

export async function CreateUser(user: IUser) {
    UserModel.create(user);
}

export async function GetUser(id: string): Promise<User | null> {
    const user: IUser | null = await UserModel.findOne({ _id: id });
    return user as User | null;
}
