import { Model, Types } from "mongoose";
import { IUser, User } from "../models/userModel";
import { Service } from "./service";
import { sign, verify } from 'jsonwebtoken'
import { AppError } from "../middlewares/errorHandler";
import { compare, hash } from "bcrypt"


export class UserService extends Service<IUser> {
    constructor(model: Model<IUser>) { super(model) }

    // returns jwt
    async signup(user: IUser): Promise<string> {
        const users = await this.findAll();

        // If email is already in use
        if (users.filter(usr => usr.email == user.email).length > 0) {
            throw new AppError("Email already in use!", 400);
        }

        const passwordHash = await hash(user.password_hash, 10)

        user.password_hash = passwordHash;

        // Create user
        const newUser = await this.create(user);
        const payload = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profile_picture: newUser.profile_picture
        }

        // create jwt using user information
        const jwt = sign({
            data: payload
        }, String(process.env.JWT_SECRET), { expiresIn: '1m' })

        return jwt;
    }

    // returns jwt
    async loginWithEmailAndPassword(email: string, password: string) {
        const users = await this.findAll({ email })
        for (const user of users) {
            const match = await compare(password, user.password_hash)

            // if passwords match
            if (match) {
                // create jwt payload
                const payload = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profile_picture: user.profile_picture
                }

                // create jwt using user information
                const jwt = sign({
                    data: payload
                }, String(process.env.JWT_SECRET), { expiresIn: '1m' })

                return jwt;
            }
        }
    }

    async logout(token: string) {
        // invalidate jwt
    }

    async validateToken(token: string): Promise<User> {
        try {
            const user = verify(token, String(process.env.JWT_SECRET))
            return user as User;
        } catch (err) {
            throw new AppError("Invalid Token Provided", 400)
        }
    }
}
