import { IUser, User, UserModel } from "../models/userModel";

export async function CreateUser(user: IUser): Promise<User> {
    const newUser: User = await UserModel.create(user)
        .then(data => data.toObject({ versionKey: false }));
    return newUser;
}

export async function GetUser(id: string): Promise<User | null> {
    const user: User | null = await UserModel.findOne({ _id: id });
    return user as User | null;
}
